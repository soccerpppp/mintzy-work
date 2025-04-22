
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

const TireChange = () => {
  // ตัวอย่างข้อมูลบันทึกการเปลี่ยนยาง
  const [changes, setChanges] = useState<ActivityLog[]>([
    {
      id: "1",
      date: "2023-06-01",
      activityType: "change",
      tireId: "T003",
      vehicleId: "1",
      mileage: 30000,
      cost: 9200,
      description: "เปลี่ยนยางหน้าซ้ายเนื่องจากดอกยางสึกหรอ",
      performedBy: "ช่างสมศักดิ์",
      newTireId: "T020",
      notes: "เปลี่ยนเป็นยางใหม่"
    },
    {
      id: "2",
      date: "2023-06-05",
      activityType: "change",
      tireId: "T012",
      vehicleId: "2",
      mileage: 32000,
      cost: 8500,
      description: "เปลี่ยนยางเนื่องจากยางรั่วซึมตลอดเวลา",
      performedBy: "ช่างสมชาย",
      newTireId: "T021",
      notes: "เปลี่ยนเป็นยางหล่อดอก"
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
    { id: "T020", name: "OTH2022050030 (Otani 11R22.5)" },
  ];
  
  const newTires = [
    { id: "T020", name: "OTH2022050030 (Otani 11R22.5) - ใหม่" },
    { id: "T021", name: "OTH2022050031 (Otani 11R22.5) - หล่อดอก" },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">บันทึกการเปลี่ยนยาง</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              บันทึกการเปลี่ยนยางใหม่
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[625px]">
            <DialogHeader>
              <DialogTitle>บันทึกการเปลี่ยนยาง</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="date">วันที่เปลี่ยน</Label>
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
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="oldTire">ยางเก่าที่ถอดออก</Label>
                  <Select>
                    <SelectTrigger id="oldTire">
                      <SelectValue placeholder="เลือกยางเก่า" />
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
                <div className="grid gap-2">
                  <Label htmlFor="newTire">ยางใหม่ที่ติดตั้ง</Label>
                  <Select>
                    <SelectTrigger id="newTire">
                      <SelectValue placeholder="เลือกยางใหม่" />
                    </SelectTrigger>
                    <SelectContent>
                      {newTires.map(tire => (
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
                  <Input id="mileage" type="number" placeholder="เช่น 30000" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="cost">ค่าใช้จ่าย (บาท)</Label>
                  <Input id="cost" type="number" placeholder="เช่น 8500" />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="performedBy">ผู้ดำเนินการ</Label>
                <Input id="performedBy" placeholder="เช่น ช่างสมศักดิ์" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">สาเหตุการเปลี่ยน</Label>
                <Textarea id="description" placeholder="บรรยายสาเหตุการเปลี่ยนยาง..." />
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
          <CardTitle>ประวัติการเปลี่ยนยาง</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>วันที่</TableHead>
                <TableHead>รถ</TableHead>
                <TableHead>ยางเก่า / ยางใหม่</TableHead>
                <TableHead>เลขไมล์</TableHead>
                <TableHead>สาเหตุการเปลี่ยน</TableHead>
                <TableHead>ค่าใช้จ่าย</TableHead>
                <TableHead className="text-right">รายละเอียด</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {changes.map((change) => (
                <TableRow key={change.id}>
                  <TableCell>{change.date}</TableCell>
                  <TableCell>
                    {vehicles.find(v => v.id === change.vehicleId)?.name.split(" ")[0]}
                  </TableCell>
                  <TableCell>
                    {tires.find(t => t.id === change.tireId)?.name.split(" ")[0]} / 
                    {newTires.find(t => t.id === change.newTireId)?.name.split(" ")[0]}
                  </TableCell>
                  <TableCell>{change.mileage.toLocaleString()} กม.</TableCell>
                  <TableCell>{change.description}</TableCell>
                  <TableCell>{change.cost.toLocaleString()} บาท</TableCell>
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

export default TireChange;
