
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
import { FileSearch, RefreshCw } from "lucide-react";

const RetreadingTracking = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  // ตัวอย่างข้อมูลการติดตามการหล่อดอกยาง
  const retreadingData = [
    { 
      id: "1", 
      tireSerial: "BDG2021060020", 
      brand: "Bridgestone",
      sentDate: "2023-06-15", 
      expectedReturnDate: "2023-06-25",
      supplier: "บริษัท ไทยบริดจสโตน จำกัด",
      originalTreadDepth: 3.2,
      cost: 3500,
      status: "processing", // processing, completed, returned
      vehicle: "70-8001",
      returnDate: null,
      newTreadDepth: null,
      notes: "ส่งหล่อดอกแบบพรีเมี่ยม"
    },
    { 
      id: "2", 
      tireSerial: "MCH2022010030", 
      brand: "Michelin",
      sentDate: "2023-06-10", 
      expectedReturnDate: "2023-06-20",
      supplier: "บริษัท สยามมิชลิน จำกัด",
      originalTreadDepth: 2.8,
      cost: 3800,
      status: "completed", // processing, completed, returned
      vehicle: "70-7520",
      returnDate: "2023-06-22",
      newTreadDepth: 13.5,
      notes: "หล่อดอกเสร็จแล้ว รอการติดตั้ง"
    },
    { 
      id: "3", 
      tireSerial: "BDG2021060015", 
      brand: "Bridgestone",
      sentDate: "2023-05-25", 
      expectedReturnDate: "2023-06-05",
      supplier: "บริษัท ไทยบริดจสโตน จำกัด",
      originalTreadDepth: 2.5,
      cost: 3500,
      status: "returned", // processing, completed, returned
      vehicle: "70-8001",
      returnDate: "2023-06-07",
      newTreadDepth: 13.2,
      notes: "ติดตั้งแล้วที่ตำแหน่งหลังซ้ายใน (2)"
    },
  ];

  // กรองข้อมูลตามการค้นหา
  const filteredRetreading = retreadingData.filter(item => 
    item.tireSerial.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.vehicle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ฟังก์ชันสำหรับแสดงสีของสถานะ
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'processing': return 'bg-yellow-500';
      case 'completed': return 'bg-blue-500';
      case 'returned': return 'bg-green-500';
      default: return 'bg-gray-300';
    }
  };

  // ฟังก์ชันสำหรับแสดงชื่อสถานะ
  const getStatusName = (status: string) => {
    switch (status) {
      case 'processing': return 'กำลังดำเนินการ';
      case 'completed': return 'หล่อดอกเสร็จแล้ว';
      case 'returned': return 'รับกลับแล้ว';
      default: return status;
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
        <CardHeader>
          <CardTitle>การติดตามการหล่อดอกยาง</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ซีเรียลยาง</TableHead>
                <TableHead>ยี่ห้อ</TableHead>
                <TableHead>รถ</TableHead>
                <TableHead>วันที่ส่ง</TableHead>
                <TableHead>ความลึกเดิม</TableHead>
                <TableHead>คาดว่าจะเสร็จ</TableHead>
                <TableHead>สถานะ</TableHead>
                <TableHead>ค่าใช้จ่าย</TableHead>
                <TableHead>ความลึกใหม่</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRetreading.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.tireSerial}</TableCell>
                  <TableCell>{item.brand}</TableCell>
                  <TableCell>{item.vehicle}</TableCell>
                  <TableCell>{item.sentDate}</TableCell>
                  <TableCell>{item.originalTreadDepth} มม.</TableCell>
                  <TableCell>{item.expectedReturnDate}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(item.status)}>
                      {getStatusName(item.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>{item.cost.toLocaleString()} บาท</TableCell>
                  <TableCell>
                    {item.newTreadDepth ? `${item.newTreadDepth} มม.` : '-'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredRetreading.length === 0 && (
            <div className="text-center py-6 text-muted-foreground">
              ไม่พบข้อมูลที่ตรงกับเงื่อนไขการค้นหา
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RetreadingTracking;
