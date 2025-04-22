import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { Checkbox } from "@/components/ui/checkbox";

interface Vehicle {
  id: string;
  registration_number: string;
  type: string;
  brand: string;
  model: string;
  wheel_positions: number;
  start_mileage?: number;
  today_mileage?: number;
  current_mileage: number;
  notes?: string;
  first_measurement_date?: string;
  last_measurement_date?: string;
}

const emptyForm = {
  registration_number: "",
  type: "",
  brand: "",
  model: "",
  wheel_positions: 0,
  start_mileage: 0,
  today_mileage: 0,
  current_mileage: 0,
  notes: "",
  first_measurement_date: "",
  last_measurement_date: ""
};

const formFields = [
  [
    { name: "registration_number", label: "ทะเบียนรถ", placeholder: "เช่น 70-8001" },
    { name: "type", label: "ประเภทรถ", placeholder: "เช่น รถบรรทุก 10 ล้อ" }
  ],
  [
    { name: "brand", label: "ยี่ห้อ", placeholder: "เช่น HINO" },
    { name: "model", label: "รุ่น", placeholder: "เช่น FM8J" }
  ],
  [
    { name: "wheel_positions", label: "จำนวนล้อ", placeholder: "เช่น 10", type: "number" }
  ],
  [
    { name: "start_mileage", label: "ระยะทางเริ่มต้น (กม.)", placeholder: "เช่น 10000", type: "number" },
    { name: "today_mileage", label: "ระยะทางวันนี้ (กม.)", placeholder: "เช่น 50", type: "number" }
  ],
  [
    { name: "first_measurement_date", label: "วันที่เริ่มต้นวัด", placeholder: "", type: "date" },
    { name: "last_measurement_date", label: "วันที่วัดล่าสุด", placeholder: "", type: "date" }
  ]
];

const VehicleManagement = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [dialog, setDialog] = useState<"add" | "edit" | "delete" | "bulkDelete" | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentVehicle, setCurrentVehicle] = useState<Vehicle | null>(null);
  const [formData, setFormData] = useState({ ...emptyForm });
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchVehicles = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.from('vehicles').select('*').order('registration_number', { ascending: true });
      if (error) throw error;
      setVehicles(data || []);
    } catch (error: any) {
      toast({ title: "เกิดข้อผิดพลาด", description: "ไม่สามารถดึงข้อมูลรถได้", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchVehicles(); }, []);

  const filteredVehicles = vehicles.filter(vehicle =>
    vehicle.registration_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => {
      const newValue = type === "number" ? Number(value) : value;
      let updated = { ...prev, [name]: newValue };
      if (name === "start_mileage" || name === "today_mileage") {
        const start = name === "start_mileage" ? newValue : prev.start_mileage || 0;
        const today = name === "today_mileage" ? newValue : prev.today_mileage || 0;
        updated.current_mileage = Number(start) + Number(today);
      }
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        current_mileage: Number(formData.start_mileage || 0) + Number(formData.today_mileage || 0),
        first_measurement_date: formData.first_measurement_date || null,
        last_measurement_date: formData.last_measurement_date || null
      };
      if (dialog === "edit" && currentVehicle) {
        const { error } = await supabase.from('vehicles').update({
          ...payload,
          updated_at: new Date().toISOString()
        }).eq('id', currentVehicle.id);
        if (error) throw error;
        toast({ title: "บันทึกสำเร็จ", description: "อัปเดตข้อมูลรถเรียบร้อยแล้ว" });
      } else if (dialog === "add") {
        const { error } = await supabase.from('vehicles').insert(payload);
        if (error) throw error;
        toast({ title: "บันทึกสำเร็จ", description: "เพิ่มข้อมูลรถใหม่เรียบร้อยแล้ว" });
      }
      fetchVehicles();
      closeDialog();
    } catch (error: any) {
      toast({ title: "เกิดข้อผิดพลาด", description: error.message || "ไม่สามารถบันทึกข้อมูลได้", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (ids: string[]) => {
    setIsSubmitting(true);
    try {
      await supabase.from('activity_logs').update({ vehicle_id: null }).in('vehicle_id', ids);
      const { error } = await supabase.from('vehicles').delete().in('id', ids);
      if (error) throw error;
      toast({ 
        title: "ลบสำเร็จ", 
        description: `ลบข้อมูลรถ ${ids.length} รายการเรียบร้อยแล้ว` 
      });
      fetchVehicles();
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
          await importVehiclesFromArray(results.data as any[]);
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
        await importVehiclesFromArray(json as any[]);
      };
      reader.readAsArrayBuffer(file);
    } else {
      toast({ title: "รองรับเฉพาะไฟล์ .csv หรือ .xlsx", variant: "destructive" });
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const importVehiclesFromArray = async (rows: any[]) => {
    try {
      const vehiclesToInsert = rows
        .map(row => ({
          registration_number: row["registration_number"] || row["ทะเบียนรถ"] || "",
          type: row["type"] || row["ประเภทรถ"] || "",
          brand: row["brand"] || row["ยี่ห้อ"] || "",
          model: row["model"] || row["รุ่น"] || "",
          wheel_positions: Number(row["wheel_positions"] || row["จำนวนล้อ"] || 0),
          start_mileage: Number(row["start_mileage"] || row["ระยะทางเริ่มต้น (กม.)"] || 0),
          today_mileage: Number(row["today_mileage"] || row["ระยะทางวันนี้ (กม.)"] || 0),
          current_mileage:
            Number(row["start_mileage"] || row["ระยะทางเริ่มต้น (กม.)"] || 0) +
            Number(row["today_mileage"] || row["ระยะทางวันนี้ (กม.)"] || 0),
          notes: row["notes"] || row["หมายเหตุ"] || "",
          first_measurement_date: row["first_measurement_date"] || row["วันที่เริ่มต้นวัด"] || "",
          last_measurement_date: row["last_measurement_date"] || row["วันที่วัดล่าสุด"] || ""
        }))
        .filter(v => v.registration_number && v.type && v.brand);

      if (vehiclesToInsert.length === 0) {
        toast({ title: "ไม่พบข้อมูลที่นำเข้า", variant: "destructive" });
        return;
      }

      const { error } = await supabase.from('vehicles').insert(vehiclesToInsert);
      if (error) throw error;
      toast({ title: "นำเข้าข้อมูลสำเร็จ", description: `เพิ่มข้อมูลรถ ${vehiclesToInsert.length} รายการ` });
      fetchVehicles();
    } catch (err: any) {
      toast({ title: "เกิดข้อผิดพลาด", description: err.message || "นำเข้าข้อมูลไม่สำเร็จ", variant: "destructive" });
    }
  };

  const handleExportTemplate = () => {
    const headers = [
      "ทะเบียนรถ",
      "ประเภทรถ",
      "ยี่ห้อ",
      "รุ่น",
      "จำนวนล้อ",
      "ระยะทางเริ่มต้น (กม.)",
      "ระยะทางวันนี้ (กม.)",
      "วันที่เริ่มต้นวัด",
      "วันที่วัดล่าสุด",
      "หมายเหตุ"
    ];
    const sampleRow = [
      "70-8001",
      "รถบรรทุก 10 ล้อ",
      "HINO",
      "FM8J",
      10,
      10000,
      50,
      "2025-01-01",
      "2025-01-15",
      "รถใหม่"
    ];
    const wsData = [headers, sampleRow];
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "VehiclesTemplate");
    XLSX.writeFile(wb, "vehicle_import_template.xlsx");
  };

  const openDialog = (type: "add" | "edit" | "delete" | "bulkDelete", vehicle?: Vehicle) => {
    setDialog(type);
    if (type === "edit" && vehicle) {
      setCurrentVehicle(vehicle);
      setFormData({
        registration_number: vehicle.registration_number,
        type: vehicle.type,
        brand: vehicle.brand,
        model: vehicle.model,
        wheel_positions: vehicle.wheel_positions,
        start_mileage: vehicle.start_mileage ?? 0,
        today_mileage: vehicle.today_mileage ?? 0,
        current_mileage: vehicle.current_mileage,
        notes: vehicle.notes || "",
        first_measurement_date: vehicle.first_measurement_date || "",
        last_measurement_date: vehicle.last_measurement_date || ""
      });
    } else if (type === "delete" && vehicle) {
      setCurrentVehicle(vehicle);
    } else {
      setFormData({ ...emptyForm });
      setCurrentVehicle(null);
    }
  };

  const closeDialog = () => {
    setDialog(null);
    setFormData({ ...emptyForm });
    setCurrentVehicle(null);
  };

  const toggleSelectAll = () => {
    setSelectedIds(prev => 
      prev.length === filteredVehicles.length ? [] : filteredVehicles.map(v => v.id)
    );
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const renderFormDialog = (
    <Dialog open={dialog === "add" || dialog === "edit"} onOpenChange={v => !v && closeDialog()}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>{dialog === "edit" ? "แก้ไขข้อมูลรถ" : "เพิ่มข้อมูลรถใหม่"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {formFields.map((row, i) => (
              <div className="grid grid-cols-2 gap-4" key={i}>
                {row.map(field => (
                  <div className="grid gap-2" key={field.name}>
                    <Label htmlFor={field.name}>{field.label}</Label>
                    <Input
                      id={dialog === "edit" ? `edit_${field.name}` : field.name}
                      name={field.name}
                      type={field.type || "text"}
                      value={formData[field.name as keyof typeof formData] || (field.type === "number" ? "" : "")}
                      onChange={handleChange}
                      placeholder={field.placeholder}
                      required={field.name !== "notes" && field.name !== "first_measurement_date" && field.name !== "last_measurement_date"}
                    />
                  </div>
                ))}
              </div>
            ))}
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>เลขไมล์ปัจจุบัน (กม.)</Label>
                <Input
                  value={Number(formData.start_mileage || 0) + Number(formData.today_mileage || 0)}
                  readOnly
                  tabIndex={-1}
                />
              </div>
              <div />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="notes">หมายเหตุ</Label>
              <Textarea
                id={dialog === "edit" ? "edit_notes" : "notes"}
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="รายละเอียดเพิ่มเติม..."
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={closeDialog}>ยกเลิก</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />กำลังบันทึก...</>) : 'บันทึก'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <div className="w-1/3">
            <Input
              placeholder="ค้นหาตามทะเบียน ประเภท หรือ ยี่ห้อ..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
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
          <Dialog open={dialog === "add"} onOpenChange={v => v ? openDialog("add") : closeDialog()}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                เพิ่มรถใหม่
              </Button>
            </DialogTrigger>
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
      {renderFormDialog}
      <Card>
        <CardHeader>
          <CardTitle>รายการรถทั้งหมด</CardTitle>
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
                      checked={selectedIds.length === filteredVehicles.length && filteredVehicles.length > 0}
                      onCheckedChange={toggleSelectAll}
                    />
                  </TableHead>
                  <TableHead>ทะเบียนรถ</TableHead>
                  <TableHead>ประเภท</TableHead>
                  <TableHead>ยี่ห้อ/รุ่น</TableHead>
                  <TableHead>จำนวนล้อ</TableHead>
                  <TableHead>เริ่มต้น (กม.)</TableHead>
                  <TableHead>วันนี้ (กม.)</TableHead>
                  <TableHead>วันที่เริ่มต้นวัด</TableHead>
                  <TableHead>วันที่วัดล่าสุด</TableHead>
                  <TableHead>เลขไมล์ปัจจุบัน</TableHead>
                  <TableHead className="text-right">การดำเนินการ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVehicles.length > 0 ? (
                  filteredVehicles.map(vehicle => (
                    <TableRow key={vehicle.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedIds.includes(vehicle.id)}
                          onCheckedChange={() => toggleSelect(vehicle.id)}
                        />
                      </TableCell>
                      <TableCell className="font-medium">{vehicle.registration_number}</TableCell>
                      <TableCell>{vehicle.type}</TableCell>
                      <TableCell>{vehicle.brand} {vehicle.model}</TableCell>
                      <TableCell>{vehicle.wheel_positions}</TableCell>
                      <TableCell>{vehicle.start_mileage ?? "-"}</TableCell>
                      <TableCell>{vehicle.today_mileage ?? "-"}</TableCell>
                      <TableCell>{vehicle.first_measurement_date || "-"}</TableCell>
                      <TableCell>{vehicle.last_measurement_date || "-"}</TableCell>
                      <TableCell>{vehicle.current_mileage?.toLocaleString()} กม.</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="icon" onClick={() => openDialog("edit", vehicle)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="icon" onClick={() => openDialog("delete", vehicle)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={11} className="h-24 text-center">
                      ไม่พบข้อมูลรถ
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      <Dialog open={dialog === "delete"} onOpenChange={v => !v && closeDialog()}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>ยืนยันการลบข้อมูลรถ</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>คุณต้องการลบข้อมูลรถทะเบียน {currentVehicle?.registration_number} ใช่หรือไม่?</p>
            <p className="text-sm text-red-500 mt-2">การดำเนินการนี้ไม่สามารถเรียกคืนได้</p>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={closeDialog}>ยกเลิก</Button>
            <Button variant="destructive" onClick={() => handleDelete([currentVehicle?.id || ""])} disabled={isSubmitting}>
              {isSubmitting ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />กำลังลบ...</>) : 'ลบ'}
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
            <p>คุณต้องการลบข้อมูลรถที่เลือก {selectedIds.length} รายการ ใช่หรือไม่?</p>
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

export default VehicleManagement;
