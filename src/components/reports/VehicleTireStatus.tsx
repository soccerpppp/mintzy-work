
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileSearch, Truck, AlertTriangle } from "lucide-react";

const VehicleTireStatus = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  // ตัวอย่างข้อมูลสถานะยางรถ
  const vehicleTireData = [
    {
      vehicleId: "1",
      registrationNumber: "70-8001",
      type: "รถบรรทุก 10 ล้อ",
      brand: "HINO",
      model: "FM8J",
      tires: [
        { position: "หน้าซ้าย", serialNumber: "BDG2021060001", treadDepth: 8.5, status: "active" },
        { position: "หน้าขวา", serialNumber: "BDG2021060002", treadDepth: 4.2, status: "alert" },
        { position: "หลังซ้ายนอก (1)", serialNumber: "BDG2021060003", treadDepth: 7.3, status: "active" },
        { position: "หลังซ้ายใน (1)", serialNumber: "BDG2021060004", treadDepth: 9.1, status: "active" },
        { position: "หลังขวานอก (1)", serialNumber: "BDG2021060005", treadDepth: 8.8, status: "active" },
        { position: "หลังขวาใน (1)", serialNumber: "BDG2021060006", treadDepth: 9.3, status: "active" },
        { position: "หลังซ้ายนอก (2)", serialNumber: "BDG2021060007", treadDepth: 6.2, status: "active" },
        { position: "หลังซ้ายใน (2)", serialNumber: "BDG2021060008", treadDepth: 3.8, status: "alert" },
        { position: "หลังขวานอก (2)", serialNumber: "BDG2021060009", treadDepth: 6.5, status: "active" },
        { position: "หลังขวาใน (2)", serialNumber: "BDG2021060010", treadDepth: 7.2, status: "active" },
      ]
    },
    {
      vehicleId: "2",
      registrationNumber: "70-7520",
      type: "รถบรรทุก 6 ล้อ",
      brand: "ISUZU",
      model: "FTR",
      tires: [
        { position: "หน้าซ้าย", serialNumber: "MCH2022010015", treadDepth: 9.8, status: "active" },
        { position: "หน้าขวา", serialNumber: "MCH2022010016", treadDepth: 9.6, status: "active" },
        { position: "หลังซ้ายนอก", serialNumber: "MCH2022010017", treadDepth: 8.2, status: "active" },
        { position: "หลังซ้ายใน", serialNumber: "MCH2022010018", treadDepth: 8.0, status: "active" },
        { position: "หลังขวานอก", serialNumber: "MCH2022010019", treadDepth: 7.9, status: "active" },
        { position: "หลังขวาใน", serialNumber: "MCH2022010020", treadDepth: 7.7, status: "active" },
      ]
    }
  ];

  // กรองข้อมูลตามการค้นหา
  const filteredVehicles = vehicleTireData.filter(vehicle => 
    vehicle.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ฟังก์ชันสำหรับแสดงสถานะยาง
  const getTireStatusColor = (status: string, treadDepth: number) => {
    if (status === "alert" || treadDepth < 5.0) {
      return "bg-red-500";
    } else if (treadDepth < 7.0) {
      return "bg-yellow-500";
    } else {
      return "bg-green-500";
    }
  };

  // ฟังก์ชันสำหรับแสดงชื่อสถานะยาง
  const getTireStatusName = (status: string, treadDepth: number) => {
    if (status === "alert" || treadDepth < 5.0) {
      return "ต้องเปลี่ยน";
    } else if (treadDepth < 7.0) {
      return "เฝ้าระวัง";
    } else {
      return "ปกติ";
    }
  };

  return (
    <div>
      <div className="flex items-center border border-input rounded-md pl-3 mb-6 max-w-md">
        <FileSearch className="h-4 w-4 text-muted-foreground" />
        <Input
          className="border-0"
          placeholder="ค้นหาตามทะเบียนรถ ประเภท หรือยี่ห้อ..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="space-y-6">
        {filteredVehicles.map((vehicle) => (
          <Card key={vehicle.vehicleId}>
            <CardHeader className="bg-muted/40">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <Truck className="h-6 w-6" />
                  <CardTitle>
                    {vehicle.registrationNumber} - {vehicle.brand} {vehicle.model}
                  </CardTitle>
                </div>
                <Badge variant="outline" className="font-normal">
                  {vehicle.type}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">สถานะยางทั้งหมด</h3>
                
                {/* แสดงจำนวนยางที่ต้องเปลี่ยน */}
                {vehicle.tires.filter(tire => tire.status === "alert" || tire.treadDepth < 5.0).length > 0 && (
                  <div className="flex items-center text-red-600">
                    <AlertTriangle className="h-4 w-4 mr-1" />
                    <span>ยางที่ต้องเปลี่ยน: {vehicle.tires.filter(tire => tire.status === "alert" || tire.treadDepth < 5.0).length}</span>
                  </div>
                )}
              </div>
              
              {/* แสดงแผนผังยางรถ */}
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                {vehicle.tires.map((tire, index) => (
                  <div key={index} className="border rounded-lg p-3 flex flex-col items-center">
                    <div className="text-sm font-medium mb-2">{tire.position}</div>
                    <Badge className={getTireStatusColor(tire.status, tire.treadDepth)}>
                      {getTireStatusName(tire.status, tire.treadDepth)}
                    </Badge>
                    <div className="text-xs mt-2 text-center">
                      <div>{tire.serialNumber}</div>
                      <div className="font-semibold mt-1">ความลึก: {tire.treadDepth} มม.</div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-end mt-4">
                <Button variant="outline" size="sm">
                  ดูรายละเอียดเพิ่มเติม
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredVehicles.length === 0 && (
          <div className="text-center py-10 text-muted-foreground">
            ไม่พบข้อมูลที่ตรงกับเงื่อนไขการค้นหา
          </div>
        )}
      </div>
    </div>
  );
};

export default VehicleTireStatus;
