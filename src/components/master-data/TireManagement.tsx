import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger 
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, Loader2, CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { Checkbox } from "@/components/ui/checkbox";

interface TireFromDB {
  id: string;
  serial_number: string;
  brand: string;
  model: string;
  size: string;
  type: string;
  position: string | null;
  vehicle_id: string | null;
  purchase_date: string;
  purchase_price: number;
  supplier: string;
  status: string;
  tread_depth: number;
  mileage: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

interface Tire {
  id: string;
  serialNumber: string;
  brand: string;
  model: string;
  size: string;
  type: 'new' | 'retreaded';
  position: string | null;
  vehicle_id: string | null;
  purchaseDate: string;
  purchasePrice: number;
  supplier: string;
  status: 'active' | 'maintenance' | 'retreading' | 'expired' | 'sold';
  treadDepth: number;
  mileage: number;
  notes?: string;
}

interface VehicleFromDB {
  id: string;
  registration_number: string;
  brand: string;
  model: string;
  type: string;
  wheel_positions: number;
  current_mileage: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

interface Vehicle {
  id: string;
  registrationNumber: string;
  brand: string;
  model: string;
  type: string;
  wheelPositions: number;
  currentMileage: number;
  notes?: string;
  tirePositions: [];
}

const TireManagement = () => {
  const [tires, setTires] = useState<Tire[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentTire, setCurrentTire] = useState<Tire | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [dialog, setDialog] = useState<"add" | "edit" | "delete" | "bulkDelete" | null>(null);

  const [formData, setFormData] = useState({
    serial_number: "",
    brand: "",
    model: "",
    size: "",
    type: "new" as 'new' | 'retreaded',
    vehicle_id: "" as string | null,
    purchase_date: new Date().toISOString().split('T')[0],
    purchase_price: 0,
    supplier: "",
    status: "active" as 'active' | 'maintenance' | 'retreading' | 'expired' | 'sold',
    tread_depth: 10,
    mileage: 0,
    notes: ""
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  // ฟังก์ชันสำหรับดาวน์โหลดแม่แบบ Excel
  const handleExportTemplate = () => {
    const headers = [
      "ซีเรียลนัมเบอร์",
      "ยี่ห้อ",
      "รุ่น",
      "ขนาด",
      "ประเภท",
      "ยานพาหนะที่ติดตั้ง",
      "วันที่ซื้อ",
      "ราคาซื้อ",
      "ผู้จำหน่าย",
      "สถานะ",
      "ความลึกดอกยาง",
      "ระยะทางที่ใช้งาน",
      "หมายเหตุ"
    ];
    const sampleRow = [
      "BDG2021060001",
      "Bridgestone",
      "R150",
      "11R22.5",
      "new",
      "",
      "2023-01-15",
      8500,
      "บริษัท ไทยบริดจสโตน จำกัด",
      "active",
      12.5,
      10000,
      "ติดตั้งครั้งแรก"
    ];
    const wsData = [headers, sampleRow];
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "TiresTemplate");
    XLSX.writeFile(wb, "tire_import_template.xlsx");
  };

  const mapDbTireToTire = (dbTire: TireFromDB): Tire => {
    return {
      id: dbTire.id,
      serialNumber: dbTire.serial_number,
      brand: dbTire.brand,
      model: dbTire.model,
      size: dbTire.size,
      type: dbTire.type as 'new' | 'retreaded',
      position: dbTire.position,
      vehicle_id: dbTire.vehicle_id,
      purchaseDate: dbTire.purchase_date,
      purchasePrice: dbTire.purchase_price,
      supplier: dbTire.supplier,
      status: dbTire.status as 'active' | 'maintenance' | 'retreading' | 'expired' | 'sold',
      treadDepth: dbTire.tread_depth,
      mileage: dbTire.mileage,
      notes: dbTire.notes
    };
  };

  const mapDbVehicleToVehicle = (dbVehicle: VehicleFromDB): Vehicle => {
    return {
      id: dbVehicle.id,
      registrationNumber: dbVehicle.registration_number,
      brand: dbVehicle.brand,
      model: dbVehicle.model,
      type: dbVehicle.type,
      wheelPositions: dbVehicle.wheel_positions,
      currentMileage: dbVehicle.current_mileage,
      notes: dbVehicle.notes,
      tirePositions: []
    };
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const { data: tiresData, error: tiresError } = await supabase
        .from('tires')
        .select('*')
        .order('serial_number', { ascending: true });
      
      if (tiresError) throw tiresError;
      setTires(tiresData ? tiresData.map(mapDbTireToTire) : []);
      
      const { data: vehiclesData, error: vehiclesError } = await supabase
        .from('vehicles')
        .select('id, registration_number, brand, model, type, wheel_positions, current_mileage, notes, created_at, updated_at')
        .order('registration_number', { ascending: true });
      
      if (vehiclesError) throw vehiclesError;
      setVehicles(vehiclesData ? vehiclesData.map(mapDbVehicleToVehicle) : []);
    } catch (error: any) {
      console.error("Error fetching data:", error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถดึงข้อมูลได้",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'maintenance': return 'bg-yellow-500';
      case 'retreading': return 'bg-blue-500';
      case 'expired': return 'bg-red-500';
      case 'sold': return 'bg-gray-500';
      default: return 'bg-gray-300';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'ใช้งาน';
      case 'maintenance': return 'ซ่อมบำรุง';
      case 'retreading': return 'หล่อดอก';
      case 'expired': return 'หมดอายุ';
      case 'sold': return 'ขายแล้ว';
      default: return status;
    }
  };

  const getTreadDepthStatus = (depth: number) => {
    if (depth < 3) {
      return {
        icon: <XCircle className="h-4 w-4 text-red-500" />,
        text: "อันตราย ต้องเปลี่ยนยางทันที",
        color: "text-red-500"
      };
    } else if (depth >= 3 && depth <= 5) {
      return {
        icon: <AlertTriangle className="h-4 w-4 text-yellow-500" />,
        text: "เปลี่ยนยางก่อนเอารถออกใช้งาน",
        color: "text-yellow-500"
      };
    } else {
      return {
        icon: <CheckCircle2 className="h-4 w-4 text-green-500" />,
        text: "ใช้งานได้",
        color: "text-green-500"
      };
    }
  };

  const filteredTires = tires.filter(tire => {
    const matchesSearch = 
      tire.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tire.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tire.model.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || tire.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: ['purchase_price', 'tread_depth', 'mileage'].includes(name) ? Number(value) : value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value === "" ? null : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (currentTire) {
        const { error } = await supabase
          .from('tires')
          .update({
            serial_number: formData.serial_number,
            brand: formData.brand,
            model: formData.model,
            size: formData.size,
            type: formData.type,
            vehicle_id: formData.vehicle_id,
            purchase_date: formData.purchase_date,
            purchase_price: formData.purchase_price,
            supplier: formData.supplier,
            status: formData.status,
            tread_depth: formData.tread_depth,
            mileage: formData.mileage,
            notes: formData.notes,
            updated_at: new Date().toISOString()
          })
          .eq('id', currentTire.id);
          
        if (error) throw error;
        
        toast({
          title: "บันทึกสำเร็จ",
          description: "อัปเดตข้อมูลยางเรียบร้อยแล้ว",
        });
        
        setIsEditDialogOpen(false);
      } else {
        const { error } = await supabase
          .from('tires')
          .insert({
            serial_number: formData.serial_number,
            brand: formData.brand,
            model: formData.model,
            size: formData.size,
            type: formData.type,
            vehicle_id: formData.vehicle_id,
            purchase_date: formData.purchase_date,
            purchase_price: formData.purchase_price,
            supplier: formData.supplier,
            status: formData.status,
            tread_depth: formData.tread_depth,
            mileage: formData.mileage,
            notes: formData.notes
          });
          
        if (error) throw error;
        
        toast({
          title: "บันทึกสำเร็จ",
          description: "เพิ่มข้อมูลยางใหม่เรียบร้อยแล้ว",
        });
        
        setIsAddDialogOpen(false);
      }
      
      fetchData();
      
      resetForm();
    } catch (error: any) {
      console.error("Error saving tire:", error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: error.message || "ไม่สามารถบันทึกข้อมูลได้",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (ids: string[]) => {
    setIsSubmitting(true);
    try {
      // อัปเดต activity_logs ที่อ้างถึงยางเหล่านี้ให้ tire_id = null ก่อน
      await supabase.from('activity_logs').update({ tire_id: null }).in('tire_id', ids);
      // แล้วค่อยลบยาง
      const { error } = await supabase.from('tires').delete().in('id', ids);
      if (error) throw error;
      toast({
        title: "ลบสำเร็จ",
        description: `ลบข้อมูลยาง ${ids.length} รายการเรียบร้อยแล้ว`,
      });
      fetchData();
      setSelectedIds([]);
      closeDialog();
    } catch (error: any) {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: error.message || "ไม่สามารถลบข้อมูลได้",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const ext = file.name.split('.').pop()?.toLowerCase();
    if (ext === "csv") {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: async (results) => {
          await importTiresFromArray(results.data as any[]);
        },
        error: (err) => {
          toast({ title: "เกิดข้อผิดพลาด", description: err.message, variant: "destructive" });
        }
      });
    } else if (ext === "xlsx") {
      const reader = new FileReader();
      reader.onload = async (evt) => {
        const data = evt.target?.result;
        if (!data) return;
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(sheet, { defval: "" });
        await importTiresFromArray(json as any[]);
      };
      reader.readAsArrayBuffer(file);
    } else {
      toast({ title: "รองรับเฉพาะไฟล์ .csv หรือ .xlsx", variant: "destructive" });
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const importTiresFromArray = async (rows: any[]) => {
    try {
      const tiresToInsert = rows
        .map(row => ({
          serial_number: row["serial_number"] || row["ซีเรียลนัมเบอร์"] || "",
          brand: row["brand"] || row["ยี่ห้อ"] || "",
          model: row["model"] || row["รุ่น"] || "",
          size: row["size"] || row["ขนาด"] || "",
          type: row["type"] || row["ประเภท"] || "new",
          vehicle_id: row["vehicle_id"] || row["ยานพาหนะที่ติดตั้ง"] || null,
          purchase_date: row["purchase_date"] || row["วันที่ซื้อ"] || "",
          purchase_price: Number(row["purchase_price"] || row["ราคาซื้อ"] || 0),
          supplier: row["supplier"] || row["ผู้จำหน่าย"] || "",
          status: row["status"] || row["สถานะ"] || "active",
          tread_depth: Number(row["tread_depth"] || row["ความลึกดอกยาง"] || 0),
          mileage: Number(row["mileage"] || row["ระยะทางที่ใช้งาน"] || 0),
          notes: row["notes"] || row["หมายเหตุ"] || ""
        }))
        .filter(t => t.serial_number && t.brand);

      if (tiresToInsert.length === 0) {
        toast({ title: "ไม่พบข้อมูลที่นำเข้า", variant: "destructive" });
        return;
      }

      const { error } = await supabase.from('tires').insert(tiresToInsert);
      if (error) throw error;
      toast({ title: "นำเข้าข้อมูลสำเร็จ", description: `เพิ่มข้อมูลยาง ${tiresToInsert.length} รายการ` });
      fetchData();
    } catch (err: any) {
      toast({ title: "เกิดข้อผิดพลาด", description: err.message || "นำเข้าข้อมูลไม่สำเร็จ", variant: "destructive" });
    }
  };

  const openEditDialog = (tire: Tire) => {
    setCurrentTire(tire);
    setFormData({
      serial_number: tire.serialNumber,
      brand: tire.brand,
      model: tire.model,
      size: tire.size,
      type: tire.type,
      vehicle_id: tire.vehicle_id,
      purchase_date: new Date(tire.purchaseDate).toISOString().split('T')[0],
      purchase_price: tire.purchasePrice,
      supplier: tire.supplier,
      status: tire.status,
      tread_depth: tire.treadDepth,
      mileage: tire.mileage,
      notes: tire.notes || ""
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (tire: Tire) => {
    setCurrentTire(tire);
    setIsDeleteDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      serial_number: "",
      brand: "",
      model: "",
      size: "",
      type: "new",
      vehicle_id: null,
      purchase_date: new Date().toISOString().split('T')[0],
      purchase_price: 0,
      supplier: "",
      status: "active",
      tread_depth: 10,
      mileage: 0,
      notes: ""
    });
    setCurrentTire(null);
  };

  const closeAddDialog = () => {
    setIsAddDialogOpen(false);
    resetForm();
  };

  const closeEditDialog = () => {
    setIsEditDialogOpen(false);
    resetForm();
  };

  const closeDialog = () => {
    setDialog(null);
    setCurrentTire(null);
    resetForm();
  };

  const toggleSelectAll = () => {
    setSelectedIds(prev => 
      prev.length === filteredTires.length ? [] : filteredTires.map(t => t.id)
    );
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const getVehicleName = (id: string | null) => {
    if (!id) return '-';
    const vehicle = vehicles.find(v => v.id === id);
    return vehicle ? `${vehicle.registrationNumber} (${vehicle.brand} ${vehicle.model})` : '-';
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <div className="flex gap-4 w-2/3">
            <Input
              className="w-1/2"
              placeholder="ค้นหาตามซีเรียล ยี่ห้อ หรือรุ่น..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-1/3">
                <SelectValue placeholder="สถานะทั้งหมด" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">สถานะทั้งหมด</SelectItem>
                <SelectItem value="active">ใช้งาน</SelectItem>
                <SelectItem value="maintenance">ซ่อมบำรุง</SelectItem>
                <SelectItem value="retreading">หล่อดอก</SelectItem>
                <SelectItem value="expired">หมดอายุ</SelectItem>
                <SelectItem value="sold">ขายแล้ว</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {selectedIds.length > 0 && (
            <Button
              variant="destructive"
              onClick={() => setDialog("bulkDelete")}
            >
              ลบรายการที่เลือก ({selectedIds.length})
            </Button>
          )}
        </div>
        <div className="flex gap-2">
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                เพิ่มยางใหม่
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[625px]">
              <DialogHeader>
                <DialogTitle>เพิ่มข้อมูลยางใหม่</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="serial_number">ซีเรียลนัมเบอร์</Label>
                      <Input 
                        id="serial_number" 
                        name="serial_number"
                        value={formData.serial_number}
                        onChange={handleChange}
                        placeholder="เช่น BDG2021060001" 
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="size">ขนาด</Label>
                      <Input 
                        id="size" 
                        name="size"
                        value={formData.size}
                        onChange={handleChange}
                        placeholder="เช่น 11R22.5" 
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="brand">ยี่ห้อ</Label>
                      <Input 
                        id="brand" 
                        name="brand"
                        value={formData.brand}
                        onChange={handleChange}
                        placeholder="เช่น Bridgestone" 
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="model">รุ่น</Label>
                      <Input 
                        id="model" 
                        name="model"
                        value={formData.model}
                        onChange={handleChange}
                        placeholder="เช่น R150" 
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="type">ประเภท</Label>
                      <Select value={formData.type} onValueChange={(v) => handleSelectChange('type', v)}>
                        <SelectTrigger id="type">
                          <SelectValue placeholder="เลือกประเภท" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">ยางใหม่</SelectItem>
                          <SelectItem value="retreaded">ยางหล่อดอก</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="tread_depth">ความลึกดอกยาง (มม.)</Label>
                      <Input 
                        id="tread_depth" 
                        name="tread_depth"
                        type="number" 
                        step="0.1" 
                        value={formData.tread_depth || ""}
                        onChange={handleChange}
                        placeholder="เช่น 12.5" 
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="purchase_date">วันที่ซื้อ</Label>
                      <Input 
                        id="purchase_date" 
                        name="purchase_date"
                        type="date" 
                        value={formData.purchase_date}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="purchase_price">ราคาซื้อ (บาท)</Label>
                      <Input 
                        id="purchase_price" 
                        name="purchase_price"
                        type="number" 
                        value={formData.purchase_price || ""}
                        onChange={handleChange}
                        placeholder="เช่น 8500" 
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="supplier">ผู้จำหน่าย</Label>
                      <Input 
                        id="supplier" 
                        name="supplier"
                        value={formData.supplier}
                        onChange={handleChange}
                        placeholder="เช่น บริษัท ไทยบริดจสโตน จำกัด" 
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="status">สถานะ</Label>
                      <Select value={formData.status} onValueChange={(v) => handleSelectChange('status', v)}>
                        <SelectTrigger id="status">
                          <SelectValue placeholder="เลือกสถานะ" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">ใช้งาน</SelectItem>
                          <SelectItem value="maintenance">ซ่อมบำรุง</SelectItem>
                          <SelectItem value="retreading">หล่อดอก</SelectItem>
                          <SelectItem value="expired">หมดอายุ</SelectItem>
                          <SelectItem value="sold">ขายแล้ว</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="vehicle_id">ยานพาหนะที่ติดตั้ง</Label>
                    <Select 
                      value={formData.vehicle_id || "none"} 
                      onValueChange={(v) => handleSelectChange('vehicle_id', v === "none" ? "" : v)}
                    >
                      <SelectTrigger id="vehicle_id">
                        <SelectValue placeholder="เลือกยานพาหนะ (หากมี)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">ไม่มีการติดตั้ง</SelectItem>
                        {vehicles.map(vehicle => (
                          <SelectItem key={vehicle.id} value={vehicle.id}>
                            {vehicle.registrationNumber} - {vehicle.brand} {vehicle.model}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="mileage">ระยะทางที่ใช้งาน (กม.)</Label>
                      <Input 
                        id="mileage" 
                        name="mileage"
                        type="number" 
                        value={formData.mileage || ""}
                        onChange={handleChange}
                        placeholder="เช่น 10000" 
                        required
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="notes">หมายเหตุ</Label>
                    <Textarea 
                      id="notes" 
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      placeholder="รายละเอียดเพิ่มเติม..." 
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={closeAddDialog}>
                    ยกเลิก
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        กำลังบันทึก...
                      </>
                    ) : (
                      'บันทึก'
                    )}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
          >
            นำเข้าข้อมูล
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.xlsx"
            style={{ display: "none" }}
            onChange={handleImportFile}
          />
          <Button
            variant="secondary"
            onClick={handleExportTemplate}
          >
            ดาวน์โหลดแม่แบบ
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>รายการยางทั้งหมด</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">
                    <Checkbox
                      checked={selectedIds.length === filteredTires.length && filteredTires.length > 0}
                      onCheckedChange={toggleSelectAll}
                    />
                  </TableHead>
                  <TableHead>ซีเรียลนัมเบอร์</TableHead>
                  <TableHead>ยี่ห้อ/รุ่น</TableHead>
                  <TableHead>ขนาด</TableHead>
                  <TableHead>ยานพาหนะ</TableHead>
                  <TableHead>ความลึกดอกยาง</TableHead>
                  <TableHead>สถานะดอกยาง</TableHead>
                  <TableHead>สถานะ</TableHead>
                  <TableHead className="text-right">การดำเนินการ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTires.length > 0 ? (
                  filteredTires.map((tire) => {
                    const treadStatus = getTreadDepthStatus(tire.treadDepth);
                    return (
                      <TableRow key={tire.id}>
                        <TableCell>
                          <Checkbox
                            checked={selectedIds.includes(tire.id)}
                            onCheckedChange={() => toggleSelect(tire.id)}
                          />
                        </TableCell>
                        <TableCell className="font-medium">{tire.serialNumber}</TableCell>
                        <TableCell>{tire.brand} {tire.model}</TableCell>
                        <TableCell>{tire.size}</TableCell>
                        <TableCell>{getVehicleName(tire.vehicle_id)}</TableCell>
                        <TableCell>{tire.treadDepth} มม.</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {treadStatus.icon}
                            <span className={treadStatus.color}>{treadStatus.text}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(tire.status)}>
                            {getStatusText(tire.status)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="icon" onClick={() => openEditDialog(tire)}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="icon" onClick={() => openDeleteDialog(tire)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} className="h-24 text-center">
                      ไม่พบข้อมูลยาง
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>แก้ไขข้อมูลยาง</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit_serial_number">ซีเรียลนัมเบอร์</Label>
                  <Input 
                    id="edit_serial_number" 
                    name="serial_number"
                    value={formData.serial_number}
                    onChange={handleChange}
                    placeholder="เช่น BDG2021060001" 
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit_size">ขนาด</Label>
                  <Input 
                    id="edit_size" 
                    name="size"
                    value={formData.size}
                    onChange={handleChange}
                    placeholder="เช่น 11R22.5" 
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit_brand">ยี่ห้อ</Label>
                  <Input 
                    id="edit_brand" 
                    name="brand"
                    value={formData.brand}
                    onChange={handleChange}
                    placeholder="เช่น Bridgestone" 
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit_model">รุ่น</Label>
                  <Input 
                    id="edit_model" 
                    name="model"
                    value={formData.model}
                    onChange={handleChange}
                    placeholder="เช่น R150" 
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit_type">ประเภท</Label>
                  <Select value={formData.type} onValueChange={(v) => handleSelectChange('type', v)}>
                    <SelectTrigger id="edit_type">
                      <SelectValue placeholder="เลือกประเภท" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">ยางใหม่</SelectItem>
                      <SelectItem value="retreaded">ยางหล่อดอก</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit_tread_depth">ความลึกดอกยาง (มม.)</Label>
                  <Input 
                    id="edit_tread_depth" 
                    name="tread_depth"
                    type="number" 
                    step="0.1" 
                    value={formData.tread_depth || ""}
                    onChange={handleChange}
                    placeholder="เช่น 12.5" 
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit_purchase_date">วันที่ซื้อ</Label>
                  <Input 
                    id="edit_purchase_date" 
                    name="purchase_date"
                    type="date" 
                    value={formData.purchase_date}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit_purchase_price">ราคาซื้อ (บาท)</Label>
                  <Input 
                    id="edit_purchase_price" 
                    name="purchase_price"
                    type="number" 
                    value={formData.purchase_price || ""}
                    onChange={handleChange}
                    placeholder="เช่น 8500" 
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit_supplier">ผู้จำหน่าย</Label>
                  <Input 
                    id="edit_supplier" 
                    name="supplier"
                    value={formData.supplier}
                    onChange={handleChange}
                    placeholder="เช่น บริษัท ไทยบริดจสโตน จำกัด" 
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit_status">สถานะ</Label>
                  <Select value={formData.status} onValueChange={(v) => handleSelectChange('status', v)}>
                    <SelectTrigger id="edit_status">
                      <SelectValue placeholder="เลือกสถานะ" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">ใช้งาน</SelectItem>
                      <SelectItem value="maintenance">ซ่อมบำรุง</SelectItem>
                      <SelectItem value="retreading">หล่อดอก</SelectItem>
                      <SelectItem value="expired">หมดอายุ</SelectItem>
                      <SelectItem value="sold">ขายแล้ว</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit_vehicle_id">ยานพาหนะที่ติดตั้ง</Label>
                <Select 
                  value={formData.vehicle_id || "none"} 
                  onValueChange={(v) => handleSelectChange('vehicle_id', v === "none" ? "" : v)}
                >
                  <SelectTrigger id="edit_vehicle_id">
                    <SelectValue placeholder="เลือกยานพาหนะ (หากมี)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">ไม่มีการติดตั้ง</SelectItem>
                    {vehicles.map(vehicle => (
                      <SelectItem key={vehicle.id} value={vehicle.id}>
                        {vehicle.registrationNumber} - {vehicle.brand} {vehicle.model}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-1 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit_mileage">ระยะทางที่ใช้งาน (กม.)</Label>
                  <Input 
                    id="edit_mileage" 
                    name="mileage"
                    type="number" 
                    value={formData.mileage || ""}
                    onChange={handleChange}
                    placeholder="เช่น 10000" 
                    required
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit_notes">หมายเหตุ</Label>
                <Textarea 
                  id="edit_notes" 
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="รายละเอียดเพิ่มเติม..." 
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={closeEditDialog}>
                ยกเลิก
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    กำลังบันทึก...
                  </>
                ) : (
                  'บันทึก'
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>ยืนยันการลบข้อมูลยาง</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>คุณต้องการลบข้อมูลยางซีเรียล {currentTire?.serialNumber} ใช่หรือไม่?</p>
            <p className="text-sm text-red-500 mt-2">การดำเนินการนี้ไม่สามารถเรียกคืนได้</p>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              ยกเลิก
            </Button>
            <Button variant="destructive" onClick={() => handleDelete([currentTire?.id || ""])} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  กำลังลบ...
                </>
              ) : (
                'ลบ'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={dialog === "bulkDelete"} onOpenChange={v => !v && closeDialog()}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>ยืนยันการลบข้อมูล</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>คุณต้องการลบข้อมูลยางที่เลือก {selectedIds.length} รายการ ใช่หรือไม่?</p>
            <p className="text-sm text-red-500 mt-2">การดำเนินการนี้ไม่สามารถเรียกคืนได้</p>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={closeDialog}>ยกเลิก</Button>
            <Button 
              variant="destructive" 
              onClick={() => handleDelete(selectedIds)}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  กำลังลบ...
                </>
              ) : (
                'ลบ'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TireManagement;
