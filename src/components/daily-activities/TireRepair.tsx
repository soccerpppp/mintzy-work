
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
import { Plus, FileText } from "lucide-react";
import { ActivityLog } from "@/types/models";

const TireRepair = () => {
  // ตัวอย่างข้อมูลบันทึกการซ่อมยาง
  const [repairs, setRepairs] = useState<ActivityLog[]>([
    {
      id: "1",
      date: "2023-06-10",
      activityType: "repair",
      tireId: "T001",
      vehicleId: "1",
      mileage: 35000,
      cost: 500,
      description: "ซ่อมรูรั่วด้านข้าง",
      performedBy: "ช่างสมศักดิ์",
      notes: "ซ่อมภายในโรงซ่อม"
    },
    {
      id: "2",
      date: "2023-06-15",
      activityType: "repair",
      tireId: "T003",
      vehicleId: "1",
      mileage: 36000,
      cost: 800,
      description: "เปลี่ยนจุกวาล์ว และตัดแต่งดอกยาง",
      performedBy: "ช่างสมชาย",
      notes: "ส่งซ่อมภายนอก"
    },
  ]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  // ตัวอย่างข้อมูลรถและยางสำหรับ dropdown
  const vehicles = [
    { id: "1", name: "70-8001 (HINO)" },
    { id: "2", name: "70-7520 (ISUZU)" },
  ];
  
  const tires = [
    { id: "T001", name: "BDG2021060001 (Bridgestone 11R22.5)" },
    { id: "T002", name: "BDG2021060002 (Bridgestone 11R22.5)" },
    { id: "T003", name: "BDG2021060003 (Bridgestone 11R22.5)" },
    { id: "T011", name: "MCH2022010015 (Michelin 11R22.5)" },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">บันทึกการซ่อมยาง</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              บันทึกการซ่อมยางใหม่
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[625px]">
            <DialogHeader>
              <DialogTitle>บันทึกการซ่อมยาง</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="date">วันที่ซ่อม</Label>
                  <Input id="date" type="date" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="repairType">ประเภทการซ่อม</Label>
                  <Select defaultValue="inside">
                    <SelectTrigger id="repairType">
                      <SelectValue placeholder="เลือกประเภทการซ่อม" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="inside">ซ่อมภายใน</SelectItem>
                      <SelectItem value="outside">ส่งซ่อมภายนอก</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
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
                <div className="grid gap-2">
                  <Label htmlFor="tire">ยาง</Label>
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
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="mileage">เลขไมล์ (กม.)</Label>
                  <Input id="mileage" type="number" placeholder="เช่น 35000" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="cost">ค่าใช้จ่าย (บาท)</Label>
                  <Input id="cost" type="number" placeholder="เช่น 500" />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="performedBy">ผู้ดำเนินการ</Label>
                <Input id="performedBy" placeholder="เช่น ช่างสมศักดิ์" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">รายละเอียดการซ่อม</Label>
                <Textarea id="description" placeholder="บรรยายรายละเอียดการซ่อม..." />
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
          <CardTitle>ประวัติการซ่อมยาง</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>วันที่</TableHead>
                <TableHead>รถ/ยาง</TableHead>
                <TableHead>เลขไมล์</TableHead>
                <TableHead>รายละเอียดการซ่อม</TableHead>
                <TableHead>ค่าใช้จ่าย</TableHead>
                <TableHead>ผู้ดำเนินการ</TableHead>
                <TableHead className="text-right">รายละเอียด</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {repairs.map((repair) => (
                <TableRow key={repair.id}>
                  <TableCell>{repair.date}</TableCell>
                  <TableCell>
                    {vehicles.find(v => v.id === repair.vehicleId)?.name.split(" ")[0]} / 
                    {tires.find(t => t.id === repair.tireId)?.name.split(" ")[0]}
                  </TableCell>
                  <TableCell>{repair.mileage.toLocaleString()} กม.</TableCell>
                  <TableCell>{repair.description}</TableCell>
                  <TableCell>{repair.cost.toLocaleString()} บาท</TableCell>
                  <TableCell>{repair.performedBy}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon">
                      <FileText className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default TireRepair;
