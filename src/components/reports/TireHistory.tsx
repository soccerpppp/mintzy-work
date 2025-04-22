
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileSearch, Calendar, Truck } from "lucide-react";

const TireHistory = () => {
  // ตัวอย่างข้อมูลประวัติการใช้งาน
  const historyData = [
    { 
      id: "1", 
      date: "2023-01-15", 
      activityType: "purchase",
      description: "ซื้อยางใหม่ Bridgestone R150",
      vehicle: "70-8001",
      tireSerial: "BDG2021060001",
      mileage: 0,
      cost: 8500,
      notes: "ติดตั้งตำแหน่ง: หน้าซ้าย"
    },
    { 
      id: "2", 
      date: "2023-05-25", 
      activityType: "rotation",
      description: "หมุนยางตามระยะทางปกติ",
      vehicle: "70-8001",
      tireSerial: "BDG2021060001",
      mileage: 25000,
      cost: 200,
      notes: "จาก: หน้าซ้าย, ไป: หลังซ้ายนอก (1)"
    },
    { 
      id: "3", 
      date: "2023-06-10", 
      activityType: "measure",
      description: "วัดความลึกดอกยาง",
      vehicle: "70-8001",
      tireSerial: "BDG2021060001",
      mileage: 35000,
      cost: 0,
      notes: "ความลึก: 8.5 มม."
    },
    { 
      id: "4", 
      date: "2023-06-10", 
      activityType: "repair",
      description: "ซ่อมรูรั่วด้านข้าง",
      vehicle: "70-8001",
      tireSerial: "BDG2021060001",
      mileage: 35000,
      cost: 500,
      notes: "ซ่อมโดย: ช่างสมศักดิ์"
    }
  ];

  const [searchTerm, setSearchTerm] = useState("");
  const [filterVehicle, setFilterVehicle] = useState<string>("all");
  const [filterActivity, setFilterActivity] = useState<string>("all");

  // ตัวอย่างข้อมูลรถสำหรับฟิลเตอร์
  const vehicles = [
    { id: "all", name: "รถทั้งหมด" },
    { id: "70-8001", name: "70-8001 (HINO)" },
    { id: "70-7520", name: "70-7520 (ISUZU)" },
  ];

  // ตัวอย่างประเภทกิจกรรมสำหรับฟิลเตอร์
  const activityTypes = [
    { id: "all", name: "กิจกรรมทั้งหมด" },
    { id: "purchase", name: "ซื้อยาง" },
    { id: "repair", name: "ซ่อมยาง" },
    { id: "change", name: "เปลี่ยนยาง" },
    { id: "rotation", name: "หมุนยาง" },
    { id: "measure", name: "วัดความลึกดอกยาง" },
    { id: "retreading", name: "หล่อดอกยาง" },
    { id: "sale", name: "ขายยาง" },
  ];

  // ฟังก์ชันสำหรับแสดงสีของป้ายกำกับกิจกรรม
  const getActivityBadgeColor = (activityType: string) => {
    switch (activityType) {
      case 'purchase': return 'bg-green-500';
      case 'repair': return 'bg-yellow-500';
      case 'change': return 'bg-blue-500';
      case 'rotation': return 'bg-purple-500';
      case 'measure': return 'bg-gray-500';
      case 'retreading': return 'bg-cyan-500';
      case 'sale': return 'bg-red-500';
      default: return 'bg-gray-300';
    }
  };

  // ฟังก์ชันสำหรับแสดงชื่อกิจกรรม
  const getActivityName = (activityType: string) => {
    switch (activityType) {
      case 'purchase': return 'ซื้อยาง';
      case 'repair': return 'ซ่อมยาง';
      case 'change': return 'เปลี่ยนยาง';
      case 'rotation': return 'หมุนยาง';
      case 'measure': return 'วัดความลึก';
      case 'retreading': return 'หล่อดอกยาง';
      case 'sale': return 'ขายยาง';
      default: return activityType;
    }
  };

  // กรองข้อมูลตามการค้นหาและตัวกรอง
  const filteredHistory = historyData.filter(item => {
    // กรองตามคำค้นหา
    const matchesSearch = 
      item.tireSerial.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // กรองตามรถ
    const matchesVehicle = filterVehicle === 'all' || item.vehicle === filterVehicle;
    
    // กรองตามประเภทกิจกรรม
    const matchesActivity = filterActivity === 'all' || item.activityType === filterActivity;
    
    return matchesSearch && matchesVehicle && matchesActivity;
  });

  return (
    <div>
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="w-full md:w-1/3">
          <div className="flex items-center border border-input rounded-md pl-3">
            <FileSearch className="h-4 w-4 text-muted-foreground" />
            <Input
              className="border-0"
              placeholder="ค้นหาตามซีเรียลหรือคำอธิบาย..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="w-full md:w-1/4">
          <div className="flex items-center">
            <Truck className="h-4 w-4 mr-2 text-muted-foreground" />
            <Select 
              value={filterVehicle} 
              onValueChange={setFilterVehicle}
            >
              <SelectTrigger>
                <SelectValue placeholder="รถทั้งหมด" />
              </SelectTrigger>
              <SelectContent>
                {vehicles.map(vehicle => (
                  <SelectItem key={vehicle.id} value={vehicle.id}>
                    {vehicle.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="w-full md:w-1/4">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
            <Select 
              value={filterActivity} 
              onValueChange={setFilterActivity}
            >
              <SelectTrigger>
                <SelectValue placeholder="กิจกรรมทั้งหมด" />
              </SelectTrigger>
              <SelectContent>
                {activityTypes.map(activity => (
                  <SelectItem key={activity.id} value={activity.id}>
                    {activity.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>ประวัติการใช้งานยาง</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>วันที่</TableHead>
                <TableHead>ซีเรียลยาง</TableHead>
                <TableHead>รถ</TableHead>
                <TableHead>กิจกรรม</TableHead>
                <TableHead>รายละเอียด</TableHead>
                <TableHead>เลขไมล์</TableHead>
                <TableHead>ค่าใช้จ่าย</TableHead>
                <TableHead>หมายเหตุ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredHistory.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.date}</TableCell>
                  <TableCell>{item.tireSerial}</TableCell>
                  <TableCell>{item.vehicle}</TableCell>
                  <TableCell>
                    <Badge className={getActivityBadgeColor(item.activityType)}>
                      {getActivityName(item.activityType)}
                    </Badge>
                  </TableCell>
                  <TableCell>{item.description}</TableCell>
                  <TableCell>{item.mileage.toLocaleString()} กม.</TableCell>
                  <TableCell>{item.cost.toLocaleString()} บาท</TableCell>
                  <TableCell>
                    <div className="max-w-[200px] truncate" title={item.notes}>
                      {item.notes}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredHistory.length === 0 && (
            <div className="text-center py-6 text-muted-foreground">
              ไม่พบข้อมูลที่ตรงกับเงื่อนไขการค้นหา
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TireHistory;
