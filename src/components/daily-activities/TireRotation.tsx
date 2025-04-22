
import { useState } from "react";
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
import { Plus, FileText, ArrowRight } from "lucide-react";
import { ActivityLog } from "@/types/models";

const TireRotation = () => {
  // ตัวอย่างข้อมูลบันทึกการหมุนยาง
  const [rotations, setRotations] = useState<ActivityLog[]>([
    {
      id: "1",
      date: "2023-05-25",
      activityType: "rotation",
      tireId: "T001",
      vehicleId: "1",
      mileage: 25000,
      cost: 200,
      description: "หมุนยางตามระยะทางปกติ",
      performedBy: "ช่างสมศักดิ์",
      newPosition: "หลังซ้ายนอก (1)",
      notes: "ยางสึกด้านในมากกว่าด้านนอก"
    },
    {
      id: "2",
      date: "2023-05-25",
      activityType: "rotation",
      tireId: "T003",
      vehicleId: "1",
      mileage: 25000,
      cost: 200,
      description: "หมุนยางตามระยะทางปกติ",
      performedBy: "ช่างสมศักดิ์",
      newPosition: "หน้าซ้าย",
      notes: ""
    },
  ]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  // ตัวอย่างข้อมูลรถและยางสำหรับ dropdown
  const vehicles = [
    { id: "1", name: "70-8001 (HINO)" },
    { id: "2", name: "70-7520 (ISUZU)" },
  ];
  
  const tires = [
    { id: "T001", name: "BDG2021060001 (Bridgestone 11R22.5) - หน้าซ้าย" },
    { id: "T002", name: "BDG2021060002 (Bridgestone 11R22.5) - หน้าขวา" },
    { id: "T003", name: "BDG2021060003 (Bridgestone 11R22.5) - หลังซ้ายนอก (1)" },
    { id: "T011", name: "MCH2022010015 (Michelin 11R22.5) - หน้าซ้าย" },
  ];
  
  // ตัวอย่างตำแหน่งยางทั้งหมด
  const positions = [
    { id: "1", name: "หน้าซ้าย" },
    { id: "2", name: "หน้าขวา" },
    { id: "3", name: "หลังซ้ายนอก (1)" },
    { id: "4", name: "หลังซ้ายใน (1)" },
    { id: "5", name: "หลังขวานอก (1)" },
    { id: "6", name: "หลังขวาใน (1)" },
    { id: "7", name: "หลังซ้ายนอก (2)" },
    { id: "8", name: "หลังซ้ายใน (2)" },
    { id: "9", name: "หลังขวานอก (2)" },
    { id: "10", name: "หลังขวาใน (2)" },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">บันทึกการหมุนยาง</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              บันทึกการหมุนยางใหม่
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[625px]">
            <DialogHeader>
              <DialogTitle>บันทึกการหมุนยาง</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="date">วันที่หมุนยาง</Label>
                  <Input id="date" type="date" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="vehicle">รถ</Label>
                  <Select>
                    <SelectTrigger id="vehicle">
                      <SelectValue placeholder="เลือกรถ" />
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
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="grid gap-2 col-span-2">
                  <Label htmlFor="tire">ยางที่จะหมุน</Label>
                  <Select>
                    <SelectTrigger id="tire">
                      <SelectValue placeholder="เลือกยาง" />
                    </SelectTrigger>
                    <SelectContent>
                      {tires.map(tire => (
                        <SelectItem key={tire.id} value={tire.id}>
                          {tire.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex justify-center items-center">
                  <ArrowRight className="h-6 w-6" />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="newPosition">ตำแหน่งใหม่</Label>
                  <Select>
                    <SelectTrigger id="newPosition">
                      <SelectValue placeholder="เลือกตำแหน่ง" />
                    </SelectTrigger>
                    <SelectContent>
                      {positions.map(position => (
                        <SelectItem key={position.id} value={position.name}>
                          {position.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="mileage">เลขไมล์ (กม.)</Label>
                  <Input id="mileage" type="number" placeholder="เช่น 25000" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="cost">ค่าใช้จ่าย (บาท)</Label>
                  <Input id="cost" type="number" placeholder="เช่น 200" />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="performedBy">ผู้ดำเนินการ</Label>
                <Input id="performedBy" placeholder="เช่น ช่างสมศักดิ์" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">สาเหตุการหมุนยาง</Label>
                <Textarea id="description" placeholder="บรรยายสาเหตุการหมุนยาง..." />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="notes">หมายเหตุ</Label>
                <Input id="notes" placeholder="รายละเอียดเพิ่มเติม..." />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                ยกเลิก
              </Button>
              <Button onClick={() => setIsAddDialogOpen(false)}>
                บันทึก
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>ประวัติการหมุนยาง</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>วันที่</TableHead>
                <TableHead>รถ</TableHead>
                <TableHead>ยาง</TableHead>
                <TableHead>ตำแหน่งเดิม</TableHead>
                <TableHead>ตำแหน่งใหม่</TableHead>
                <TableHead>เลขไมล์</TableHead>
                <TableHead className="text-right">รายละเอียด</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rotations.map((rotation) => {
                const tire = tires.find(t => t.id === rotation.tireId);
                const originalPosition = tire?.name.split(" - ")[1] || "";
                
                return (
                  <TableRow key={rotation.id}>
                    <TableCell>{rotation.date}</TableCell>
                    <TableCell>
                      {vehicles.find(v => v.id === rotation.vehicleId)?.name.split(" ")[0]}
                    </TableCell>
                    <TableCell>
                      {tire?.name.split(" ")[0]}
                    </TableCell>
                    <TableCell>{originalPosition}</TableCell>
                    <TableCell>{rotation.newPosition}</TableCell>
                    <TableCell>{rotation.mileage.toLocaleString()} กม.</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon">
                        <FileText className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default TireRotation;
