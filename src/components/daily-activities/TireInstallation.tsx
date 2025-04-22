
import { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger, 
  DialogFooter,
  DialogClose 
} from "@/components/ui/dialog";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Check, X, Save } from "lucide-react";
import { toast } from "sonner";
import { Vehicle, Tire } from "@/types/models";

const TireInstallation = () => {
  const [selectedVehicle, setSelectedVehicle] = useState<string>("");
  const [selectedTire, setSelectedTire] = useState<string>("");
  const [selectedPosition, setSelectedPosition] = useState<string>("");
  const [installationType, setInstallationType] = useState<"new" | "replace">("new");
  const [mileage, setMileage] = useState<string>("");
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [availableTires, setAvailableTires] = useState<Tire[]>([]);
  const [installedTires, setInstalledTires] = useState<{position: string, tireId: string, serialNumber: string}[]>([]);
  
  // ตัวอย่างข้อมูลรถ
  const vehicles: Vehicle[] = [
    {
      id: "1",
      registrationNumber: "70-8001",
      type: "รถบรรทุก 10 ล้อ",
      brand: "HINO",
      model: "FM8J",
      wheelPositions: 10,
      currentMileage: 45000,
      tirePositions: [
        { position: "หน้าซ้าย", tireId: "T001" },
        { position: "หน้าขวา", tireId: "T002" },
        { position: "หลังซ้ายนอก (1)", tireId: "T003" },
        { position: "หลังซ้ายใน (1)", tireId: "T004" },
        { position: "หลังขวานอก (1)", tireId: "T005" },
        { position: "หลังขวาใน (1)", tireId: "T006" },
        { position: "หลังซ้ายนอก (2)", tireId: "T007" },
        { position: "หลังซ้ายใน (2)", tireId: "T008" },
        { position: "หลังขวานอก (2)", tireId: "T009" },
        { position: "หลังขวาใน (2)", tireId: "T010" },
      ],
      notes: "รถกระบะพื้นเรียบ"
    },
    {
      id: "2",
      registrationNumber: "70-7520",
      type: "รถบรรทุก 6 ล้อ",
      brand: "ISUZU",
      model: "FTR",
      wheelPositions: 6,
      currentMileage: 32000,
      tirePositions: [
        { position: "หน้าซ้าย", tireId: "T011" },
        { position: "หน้าขวา", tireId: "T012" },
        { position: "หลังซ้ายนอก", tireId: "T013" },
        { position: "หลังซ้ายใน", tireId: "T014" },
        { position: "หลังขวานอก", tireId: "T015" },
        { position: "หลังขวาใน", tireId: "T016" },
      ],
      notes: "รถตู้ทึบ"
    }
  ];

  // ตัวอย่างข้อมูลยาง
  const tires: Tire[] = [
    {
      id: "T001",
      serialNumber: "BDG2021060001",
      brand: "Bridgestone",
      model: "R150",
      size: "11R22.5",
      type: "new",
      position: "หน้าซ้าย",
      vehicleId: "1",
      purchaseDate: "2023-01-15",
      purchasePrice: 8500,
      supplier: "บริษัท ไทยบริดจสโตน จำกัด",
      status: "active",
      treadDepth: 12.5,
      mileage: 10000,
      notes: "ยางใหม่ล่าสุด"
    },
    {
      id: "T020",
      serialNumber: "OTH2022050030",
      brand: "Otani",
      model: "OH-110",
      size: "11R22.5",
      type: "new",
      vehicleId: undefined, // ยางที่ยังไม่ได้ติดตั้ง
      purchaseDate: "2023-05-20",
      purchasePrice: 5500,
      supplier: "บริษัท โอตานิ จำกัด",
      status: "active",
      treadDepth: 13.0,
      mileage: 0,
      notes: "ยางใหม่ยังไม่ได้ติดตั้ง"
    },
    {
      id: "T021",
      serialNumber: "MCH2023070001",
      brand: "Michelin",
      model: "XZE2+",
      size: "11R22.5",
      type: "new",
      vehicleId: undefined, // ยางที่ยังไม่ได้ติดตั้ง
      purchaseDate: "2023-07-10",
      purchasePrice: 9200,
      supplier: "บริษัท สยามมิชลิน จำกัด",
      status: "active",
      treadDepth: 14.0,
      mileage: 0,
      notes: "ยางใหม่ยังไม่ได้ติดตั้ง"
    }
  ];

  // ฟังก์ชันสำหรับกรองยางที่ไม่ได้ติดตั้ง
  useEffect(() => {
    // กรองยางที่ยังไม่ได้ติดตั้ง (vehicleId เป็น undefined)
    const uninstalledTires = tires.filter(tire => !tire.vehicleId);
    setAvailableTires(uninstalledTires);
  }, []);

  // ฟังก์ชันสำหรับเลือกรถ
  const handleVehicleSelect = (vehicleId: string) => {
    setSelectedVehicle(vehicleId);
    
    // รีเซ็ตค่าเมื่อเปลี่ยนรถ
    setInstalledTires([]);
    setSelectedPosition("");
    setSelectedTire("");
    
    // หารถที่เลือก
    const vehicle = vehicles.find(v => v.id === vehicleId);
    if (vehicle) {
      setMileage(vehicle.currentMileage.toString());
      
      // สร้างรายการยางที่ติดตั้งอยู่แล้ว
      const installedTiresList = vehicle.tirePositions.map(tp => {
        const tire = tires.find(t => t.id === tp.tireId);
        return {
          position: tp.position,
          tireId: tp.tireId || "",
          serialNumber: tire ? tire.serialNumber : "ไม่มียาง"
        };
      });
      setInstalledTires(installedTiresList);
    }
  };

  // ฟังก์ชันสำหรับเลือกตำแหน่ง
  const handlePositionSelect = (position: string) => {
    setSelectedPosition(position);
  };

  // ฟังก์ชันสำหรับเลือกยาง
  const handleTireSelect = (tireId: string) => {
    setSelectedTire(tireId);
  };

  // ฟังก์ชันสำหรับเพิ่มยางในตำแหน่งที่เลือก
  const handleInstallTire = () => {
    if (!selectedVehicle || !selectedPosition || !selectedTire || !mileage) {
      toast.error("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    // หารถและยางที่เลือก
    const vehicle = vehicles.find(v => v.id === selectedVehicle);
    const tire = availableTires.find(t => t.id === selectedTire);

    if (!vehicle || !tire) {
      toast.error("ไม่พบข้อมูลรถหรือยาง");
      return;
    }

    // อัปเดตรายการยางที่ติดตั้ง
    const updatedInstalledTires = [...installedTires];
    const tireIndex = updatedInstalledTires.findIndex(t => t.position === selectedPosition);
    
    if (tireIndex !== -1) {
      updatedInstalledTires[tireIndex].tireId = selectedTire;
      updatedInstalledTires[tireIndex].serialNumber = tire.serialNumber;
    }

    setInstalledTires(updatedInstalledTires);
    
    // รีเซ็ตค่าหลังติดตั้ง
    setSelectedPosition("");
    setSelectedTire("");

    toast.success(`ติดตั้งยาง ${tire.serialNumber} ในตำแหน่ง ${selectedPosition} สำเร็จ`);
  };

  // ฟังก์ชันสำหรับบันทึกการติดตั้งยางทั้งหมด
  const handleSaveAllInstallations = () => {
    if (!selectedVehicle || !mileage) {
      toast.error("กรุณาเลือกรถและระบุเลขไมล์");
      return;
    }

    // ตรวจสอบว่ามีการติดตั้งยางหรือไม่
    const hasInstalledTires = installedTires.some(tire => tire.tireId !== "");
    
    if (!hasInstalledTires) {
      toast.error("ยังไม่มีการติดตั้งยาง");
      return;
    }

    toast.success("บันทึกการติดตั้งยางสำเร็จ");
    
    // รีเซ็ตค่าหลังบันทึก
    setSelectedVehicle("");
    setInstalledTires([]);
    setMileage("");
    setSelectedPosition("");
    setSelectedTire("");
  };

  // สร้างตำแหน่งล้อสำหรับการเลือก
  const getWheelPositions = () => {
    if (!selectedVehicle) return [];
    
    const vehicle = vehicles.find(v => v.id === selectedVehicle);
    if (!vehicle) return [];
    
    return vehicle.tirePositions.map(tp => ({
      value: tp.position,
      label: tp.position
    }));
  };

  // สร้างแผนผังตำแหน่งยาง (Truck Tire Diagram)
  const renderTireDiagram = () => {
    if (!selectedVehicle) return null;
    
    const vehicle = vehicles.find(v => v.id === selectedVehicle);
    if (!vehicle) return null;

    // ตำแหน่งของล้อ (เรียงตามตำแหน่งจริงบนรถ)
    const positionGroups = {
      front: vehicle.tirePositions.filter(tp => tp.position.includes("หน้า")),
      rear1: vehicle.tirePositions.filter(tp => tp.position.includes("(1)")),
      rear2: vehicle.tirePositions.filter(tp => tp.position.includes("(2)"))
    };

    // รายละเอียดรถ
    const vehicleDetails = `${vehicle.registrationNumber} - ${vehicle.brand} ${vehicle.model}`;
    
    // ประเภทรถ และจำนวนล้อ
    const vehicleTypeAndWheels = `${vehicle.type} - ${vehicle.wheelPositions} ล้อ`;
    
    return (
      <Card className="mt-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-center">{vehicleDetails}</CardTitle>
          <p className="text-center text-sm text-muted-foreground">{vehicleTypeAndWheels}</p>
        </CardHeader>
        <CardContent>
          <div className="relative bg-green-200 border-2 border-green-400 rounded-lg p-4 mx-auto w-full max-w-lg h-[300px]">
            {/* ส่วนหัวรถ */}
            <div className="absolute top-[20px] left-1/2 transform -translate-x-1/2 w-20 h-16 bg-white border-2 border-gray-400 rounded-t-lg"></div>
            
            {/* ตัวรถ */}
            <div className="absolute top-[80px] left-1/2 transform -translate-x-1/2 w-40 h-[200px] bg-gray-200 border-2 border-gray-400"></div>
            
            {/* ล้อหน้า */}
            {positionGroups.front.length > 0 && (
              <div className="absolute top-[50px] left-1/2 transform -translate-x-1/2 flex justify-between w-[180px]">
                {positionGroups.front.map((tp, index) => {
                  const isLeft = tp.position.includes("ซ้าย");
                  const tire = installedTires.find(t => t.position === tp.position);
                  
                  return (
                    <div 
                      key={index}
                      className={`w-14 h-14 rounded-lg flex items-center justify-center 
                                border-4 ${selectedPosition === tp.position ? 'border-blue-500' : 'border-red-800'} 
                                bg-red-200 cursor-pointer text-center relative`}
                      onClick={() => handlePositionSelect(tp.position)}
                    >
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-lg font-bold">{isLeft ? 1 : 2}</span>
                      </div>
                      {tire?.tireId && (
                        <div className="absolute -bottom-6 text-xs font-semibold bg-white px-1 rounded border">
                          {tire.serialNumber.substring(tire.serialNumber.length - 4)}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
            
            {/* ล้อหลังแถวแรก */}
            {positionGroups.rear1.length > 0 && (
              <div className="absolute top-[130px] left-1/2 transform -translate-x-1/2 flex justify-between w-[220px]">
                <div className="flex flex-col gap-1">
                  {positionGroups.rear1.filter(tp => tp.position.includes("ซ้าย")).map((tp, index) => {
                    const tire = installedTires.find(t => t.position === tp.position);
                    const positionNumber = tp.position.includes("นอก") ? 3 : 4;
                    
                    return (
                      <div 
                        key={index}
                        className={`w-12 h-12 rounded-lg flex items-center justify-center 
                                  border-4 ${selectedPosition === tp.position ? 'border-blue-500' : 'border-red-800'} 
                                  bg-red-200 cursor-pointer text-center relative`}
                        onClick={() => handlePositionSelect(tp.position)}
                      >
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-lg font-bold">{positionNumber}</span>
                        </div>
                        {tire?.tireId && (
                          <div className="absolute -right-16 text-xs font-semibold bg-white px-1 rounded border">
                            {tire.serialNumber.substring(tire.serialNumber.length - 4)}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                <div className="flex flex-col gap-1">
                  {positionGroups.rear1.filter(tp => tp.position.includes("ขวา")).map((tp, index) => {
                    const tire = installedTires.find(t => t.position === tp.position);
                    const positionNumber = tp.position.includes("นอก") ? 5 : 6;
                    
                    return (
                      <div 
                        key={index}
                        className={`w-12 h-12 rounded-lg flex items-center justify-center 
                                  border-4 ${selectedPosition === tp.position ? 'border-blue-500' : 'border-red-800'} 
                                  bg-red-200 cursor-pointer text-center relative`}
                        onClick={() => handlePositionSelect(tp.position)}
                      >
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-lg font-bold">{positionNumber}</span>
                        </div>
                        {tire?.tireId && (
                          <div className="absolute -left-16 text-xs font-semibold bg-white px-1 rounded border">
                            {tire.serialNumber.substring(tire.serialNumber.length - 4)}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            
            {/* ล้อหลังแถวสอง */}
            {positionGroups.rear2.length > 0 && (
              <div className="absolute top-[210px] left-1/2 transform -translate-x-1/2 flex justify-between w-[220px]">
                <div className="flex flex-col gap-1">
                  {positionGroups.rear2.filter(tp => tp.position.includes("ซ้าย")).map((tp, index) => {
                    const tire = installedTires.find(t => t.position === tp.position);
                    const positionNumber = tp.position.includes("นอก") ? 7 : 8;
                    
                    return (
                      <div 
                        key={index}
                        className={`w-12 h-12 rounded-lg flex items-center justify-center 
                                  border-4 ${selectedPosition === tp.position ? 'border-blue-500' : 'border-red-800'} 
                                  bg-red-200 cursor-pointer text-center relative`}
                        onClick={() => handlePositionSelect(tp.position)}
                      >
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-lg font-bold">{positionNumber}</span>
                        </div>
                        {tire?.tireId && (
                          <div className="absolute -right-16 text-xs font-semibold bg-white px-1 rounded border">
                            {tire.serialNumber.substring(tire.serialNumber.length - 4)}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                <div className="flex flex-col gap-1">
                  {positionGroups.rear2.filter(tp => tp.position.includes("ขวา")).map((tp, index) => {
                    const tire = installedTires.find(t => t.position === tp.position);
                    const positionNumber = tp.position.includes("นอก") ? 9 : 10;
                    
                    return (
                      <div 
                        key={index}
                        className={`w-12 h-12 rounded-lg flex items-center justify-center 
                                  border-4 ${selectedPosition === tp.position ? 'border-blue-500' : 'border-red-800'} 
                                  bg-red-200 cursor-pointer text-center relative`}
                        onClick={() => handlePositionSelect(tp.position)}
                      >
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-lg font-bold">{positionNumber}</span>
                        </div>
                        {tire?.tireId && (
                          <div className="absolute -left-16 text-xs font-semibold bg-white px-1 rounded border">
                            {tire.serialNumber.substring(tire.serialNumber.length - 4)}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            
            {/* คำแนะนำ */}
            <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 text-xs text-center w-full px-2">
              <p className="text-red-600 font-bold">หมายเหตุ: คลิกที่ล้อเพื่อเลือกตำแหน่งการติดตั้งยาง</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div>
      <Tabs defaultValue="new" onValueChange={(value) => setInstallationType(value as "new" | "replace")}>
        <TabsList className="mb-6">
          <TabsTrigger value="new">ติดตั้งยางครั้งแรก</TabsTrigger>
          <TabsTrigger value="replace">เปลี่ยน/สลับยางบางตำแหน่ง</TabsTrigger>
        </TabsList>
        
        <TabsContent value="new">
          <Card>
            <CardHeader>
              <CardTitle>ติดตั้งยางใหม่ทั้งคัน</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="vehicle">รถที่ต้องการติดตั้งยาง</Label>
                    <Select
                      value={selectedVehicle}
                      onValueChange={handleVehicleSelect}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="เลือกรถ" />
                      </SelectTrigger>
                      <SelectContent>
                        {vehicles.map((vehicle) => (
                          <SelectItem key={vehicle.id} value={vehicle.id}>
                            {vehicle.registrationNumber} - {vehicle.brand} {vehicle.model}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="mileage">เลขไมล์ปัจจุบัน (กม.)</Label>
                    <Input
                      id="mileage"
                      type="number"
                      value={mileage}
                      onChange={(e) => setMileage(e.target.value)}
                      placeholder="กรอกเลขไมล์ปัจจุบัน"
                    />
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="date">วันที่ติดตั้ง</Label>
                  <Input
                    id="date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>
                
                {selectedVehicle && renderTireDiagram()}
                
                {selectedVehicle && (
                  <div className="grid gap-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium">ตำแหน่งที่ต้องการติดตั้งยาง</h3>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={handleSaveAllInstallations}
                        disabled={!installedTires.some(tire => tire.tireId !== "")}
                      >
                        <Save className="h-4 w-4 mr-2" />
                        บันทึกการติดตั้งทั้งหมด
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="grid gap-2">
                        <Label htmlFor="position">ตำแหน่งล้อ</Label>
                        <Select
                          value={selectedPosition}
                          onValueChange={handlePositionSelect}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="เลือกตำแหน่ง" />
                          </SelectTrigger>
                          <SelectContent>
                            {getWheelPositions().map((position) => (
                              <SelectItem key={position.value} value={position.value}>
                                {position.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="tire">ยางที่ต้องการติดตั้ง</Label>
                        <Select
                          value={selectedTire}
                          onValueChange={handleTireSelect}
                          disabled={!selectedPosition}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="เลือกยาง" />
                          </SelectTrigger>
                          <SelectContent>
                            {availableTires.map((tire) => (
                              <SelectItem key={tire.id} value={tire.id}>
                                {tire.serialNumber} - {tire.brand} {tire.model}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="flex items-end">
                        <Button 
                          onClick={handleInstallTire} 
                          disabled={!selectedPosition || !selectedTire}
                          className="w-full"
                        >
                          <Check className="h-4 w-4 mr-2" />
                          ติดตั้งยาง
                        </Button>
                      </div>
                    </div>
                    
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ตำแหน่ง</TableHead>
                          <TableHead>ยางที่ติดตั้ง</TableHead>
                          <TableHead>สถานะ</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {installedTires.map((tire, index) => (
                          <TableRow key={index}>
                            <TableCell>{tire.position}</TableCell>
                            <TableCell>{tire.serialNumber !== "ไม่มียาง" ? tire.serialNumber : "-"}</TableCell>
                            <TableCell>
                              {tire.serialNumber !== "ไม่มียาง" ? (
                                <Badge className="bg-green-500">ติดตั้งแล้ว</Badge>
                              ) : (
                                <Badge variant="outline">ยังไม่ได้ติดตั้ง</Badge>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="replace">
          <Card>
            <CardHeader>
              <CardTitle>เปลี่ยน/สลับยางบางตำแหน่ง</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="vehicle">รถที่ต้องการเปลี่ยน/สลับยาง</Label>
                    <Select
                      value={selectedVehicle}
                      onValueChange={handleVehicleSelect}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="เลือกรถ" />
                      </SelectTrigger>
                      <SelectContent>
                        {vehicles.map((vehicle) => (
                          <SelectItem key={vehicle.id} value={vehicle.id}>
                            {vehicle.registrationNumber} - {vehicle.brand} {vehicle.model}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="mileage">เลขไมล์ปัจจุบัน (กม.)</Label>
                    <Input
                      id="mileage"
                      type="number"
                      value={mileage}
                      onChange={(e) => setMileage(e.target.value)}
                      placeholder="กรอกเลขไมล์ปัจจุบัน"
                    />
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="date">วันที่ดำเนินการ</Label>
                  <Input
                    id="date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>
                
                {selectedVehicle && renderTireDiagram()}
                
                {selectedVehicle && (
                  <div className="grid gap-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium">การสลับยางและเปลี่ยนยางใหม่</h3>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="default" size="sm">
                            <Save className="h-4 w-4 mr-2" />
                            บันทึกการดำเนินการ
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>ยืนยันการเปลี่ยน/สลับยาง</DialogTitle>
                          </DialogHeader>
                          <div className="py-4 space-y-4">
                            <p>คุณต้องการบันทึกการเปลี่ยน/สลับยางตามที่กำหนดไว้หรือไม่?</p>
                            <p className="text-sm text-muted-foreground">รถทะเบียน: {vehicles.find(v => v.id === selectedVehicle)?.registrationNumber}</p>
                            <p className="text-sm text-muted-foreground">เลขไมล์: {mileage} กม.</p>
                          </div>
                          <DialogFooter>
                            <DialogClose asChild>
                              <Button variant="outline">ยกเลิก</Button>
                            </DialogClose>
                            <DialogClose asChild>
                              <Button onClick={() => {
                                toast.success("บันทึกการเปลี่ยน/สลับยางสำเร็จ");
                                setSelectedVehicle("");
                                setInstalledTires([]);
                                setMileage("");
                                setSelectedPosition("");
                                setSelectedTire("");
                              }}>ยืนยัน</Button>
                            </DialogClose>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                    
                    <div className="p-4 border rounded-lg bg-yellow-50">
                      <p className="text-sm mb-2"><span className="font-bold">คำแนะนำ:</span> คลิกที่ตำแหน่งล้อในแผนผังด้านบนเพื่อเลือกตำแหน่ง จากนั้นเลือกยางที่ต้องการติดตั้งหรือสลับ</p>
                      <p className="text-sm">สำหรับการสลับยาง ให้ติดตั้งยางจากตำแหน่งอื่นในรถ หรือติดตั้งยางใหม่ในตำแหน่งที่ต้องการ</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="grid gap-2">
                        <Label htmlFor="position">ตำแหน่งล้อที่ต้องการเปลี่ยน</Label>
                        <Select
                          value={selectedPosition}
                          onValueChange={handlePositionSelect}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="เลือกตำแหน่ง" />
                          </SelectTrigger>
                          <SelectContent>
                            {getWheelPositions().map((position) => (
                              <SelectItem key={position.value} value={position.value}>
                                {position.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="tire">ยางที่ต้องการติดตั้ง</Label>
                        <Select
                          value={selectedTire}
                          onValueChange={handleTireSelect}
                          disabled={!selectedPosition}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="เลือกยาง" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="new-tire" className="font-semibold">-- ยางใหม่ --</SelectItem>
                            {availableTires.map((tire) => (
                              <SelectItem key={tire.id} value={tire.id}>
                                {tire.serialNumber} - {tire.brand} {tire.model}
                              </SelectItem>
                            ))}
                            <SelectItem value="swap-tire" className="font-semibold">-- สลับจากตำแหน่งอื่น --</SelectItem>
                            {installedTires
                              .filter(t => t.tireId && t.position !== selectedPosition)
                              .map((tire, index) => (
                                <SelectItem key={`swap-${index}`} value={`swap-${tire.position}`}>
                                  {tire.position} - {tire.serialNumber}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="flex items-end">
                        <Button 
                          onClick={handleInstallTire} 
                          disabled={!selectedPosition || !selectedTire}
                          className="w-full"
                        >
                          {selectedTire?.startsWith('swap-') ? 'สลับยาง' : 'ติดตั้งยาง'}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TireInstallation;
