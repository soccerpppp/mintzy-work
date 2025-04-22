
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
import { FileSearch, AlertTriangle, RefreshCw } from "lucide-react";

const TireAlerts = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  // ตัวอย่างข้อมูลการแจ้งเตือนยาง
  const alertsData = [
    { 
      id: "1", 
      tireSerial: "BDG2021060002", 
      brand: "Bridgestone",
      model: "R150",
      vehicle: "70-8001",
      position: "หน้าขวา",
      treadDepth: 4.2, // ต่ำกว่าเกณฑ์ 5.0 มม.
      lastMeasureDate: "2023-06-10",
      mileage: 35000,
      alertType: "treadDepth", // ประเภทการแจ้งเตือน
      alertLevel: "critical", // ระดับความสำคัญ
      description: "ความลึกดอกยางต่ำกว่าเกณฑ์ (5.0 มม.) ควรเปลี่ยนโดยเร็ว",
      status: "pending" // สถานะการแก้ไข
    },
    { 
      id: "2", 
      tireSerial: "BDG2021060008", 
      brand: "Bridgestone",
      model: "R150",
      vehicle: "70-8001",
      position: "หลังซ้ายใน (2)",
      treadDepth: 3.8, // ต่ำกว่าเกณฑ์ 5.0 มม.
      lastMeasureDate: "2023-06-10",
      mileage: 35000,
      alertType: "treadDepth", // ประเภทการแจ้งเตือน
      alertLevel: "critical", // ระดับความสำคัญ
      description: "ความลึกดอกยางต่ำกว่าเกณฑ์ (5.0 มม.) ควรเปลี่ยนโดยเร็ว",
      status: "pending" // สถานะการแก้ไข
    },
    { 
      id: "3", 
      tireSerial: "MCH2022010017", 
      brand: "Michelin",
      model: "XZE2+",
      vehicle: "70-7520",
      position: "หลังซ้ายนอก",
      treadDepth: 8.2, // ปกติ
      lastMeasureDate: "2023-06-15",
      mileage: 32000,
      alertType: "rotation", // ประเภทการแจ้งเตือน (เกินระยะเวลาหมุนยาง)
      alertLevel: "warning", // ระดับความสำคัญ
      description: "เกินระยะเวลาการหมุนยางปกติ (15,000 กม.) ควรหมุนยางเร็วๆ นี้",
      status: "resolved" // สถานะการแก้ไข
    },
  ];

  // กรองข้อมูลตามการค้นหา
  const filteredAlerts = alertsData.filter(alert => 
    alert.tireSerial.toLowerCase().includes(searchTerm.toLowerCase()) ||
    alert.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
    alert.vehicle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    alert.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ฟังก์ชันสำหรับแสดงสีของระดับความสำคัญ
  const getAlertLevelColor = (level: string) => {
    switch (level) {
      case 'critical': return 'bg-red-500';
      case 'warning': return 'bg-yellow-500';
      case 'info': return 'bg-blue-500';
      default: return 'bg-gray-300';
    }
  };

  // ฟังก์ชันสำหรับแสดงชื่อระดับความสำคัญ
  const getAlertLevelName = (level: string) => {
    switch (level) {
      case 'critical': return 'วิกฤต';
      case 'warning': return 'เตือน';
      case 'info': return 'แจ้งเพื่อทราบ';
      default: return level;
    }
  };

  // ฟังก์ชันสำหรับแสดงชื่อสถานะการแก้ไข
  const getStatusName = (status: string) => {
    switch (status) {
      case 'pending': return 'รอดำเนินการ';
      case 'in_progress': return 'กำลังดำเนินการ';
      case 'resolved': return 'แก้ไขแล้ว';
      default: return status;
    }
  };

  // ฟังก์ชันสำหรับแสดงสีของสถานะการแก้ไข
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-red-500';
      case 'in_progress': return 'bg-yellow-500';
      case 'resolved': return 'bg-green-500';
      default: return 'bg-gray-300';
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center border border-input rounded-md pl-3 w-1/3">
          <FileSearch className="h-4 w-4 text-muted-foreground" />
          <Input
            className="border-0"
            placeholder="ค้นหาตามซีเรียล ยี่ห้อ หรือรถ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            รีเฟรช
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>การแจ้งเตือนยาง</CardTitle>
          <div className="flex items-center text-red-600">
            <AlertTriangle className="h-4 w-4 mr-1" />
            <span>การแจ้งเตือนที่รอดำเนินการ: {alertsData.filter(alert => alert.status === "pending").length}</span>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ความสำคัญ</TableHead>
                <TableHead>ซีเรียลยาง</TableHead>
                <TableHead>รถ</TableHead>
                <TableHead>ตำแหน่ง</TableHead>
                <TableHead>รายละเอียดการแจ้งเตือน</TableHead>
                <TableHead>วันที่แจ้งเตือน</TableHead>
                <TableHead>สถานะ</TableHead>
                <TableHead className="text-right">การดำเนินการ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAlerts.map((alert) => (
                <TableRow key={alert.id}>
                  <TableCell>
                    <Badge className={getAlertLevelColor(alert.alertLevel)}>
                      {getAlertLevelName(alert.alertLevel)}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">
                    {alert.tireSerial}
                    <div className="text-xs text-muted-foreground">{alert.brand} {alert.model}</div>
                  </TableCell>
                  <TableCell>{alert.vehicle}</TableCell>
                  <TableCell>{alert.position}</TableCell>
                  <TableCell>
                    <div className="max-w-[300px]">{alert.description}</div>
                  </TableCell>
                  <TableCell>{alert.lastMeasureDate}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(alert.status)}>
                      {getStatusName(alert.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {alert.status !== "resolved" && (
                      <Button variant="outline" size="sm">
                        แก้ไข
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredAlerts.length === 0 && (
            <div className="text-center py-6 text-muted-foreground">
              ไม่พบข้อมูลที่ตรงกับเงื่อนไขการค้นหา
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TireAlerts;
