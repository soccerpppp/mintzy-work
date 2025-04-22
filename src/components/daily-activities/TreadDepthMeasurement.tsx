
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Plus, FileText, AlertTriangle } from "lucide-react";
import { ActivityLog } from "@/types/models";

const TreadDepthMeasurement = () => {
  // ตัวอย่างข้อมูลบันทึกการวัดความลึกดอกยาง
  const [measurements, setMeasurements] = useState<ActivityLog[]>([
    {
      id: "1",
      date: "2023-06-10",
      activityType: "measure",
      tireId: "T001",
      vehicleId: "1",
      mileage: 35000,
      cost: 0,
      description: "วัดความลึกดอกยางตามระยะเวลา",
      performedBy: "นายสมบัติ",
      measurementValue: 8.5, // ความลึกดอกยาง (มม.)
      notes: ""
    },
    {
      id: "2",
      date: "2023-06-10",
      activityType: "measure",
      tireId: "T002",
      vehicleId: "1",
      mileage: 35000,
      cost: 0,
      description: "วัดความลึกดอกยางตามระยะเวลา",
      performedBy: "นายสมบัติ",
      measurementValue: 4.2, // ความลึกดอกยาง (มม.) - ต่ำกว่าเกณฑ์
      notes: "ความลึกดอกยางต่ำกว่าเกณฑ์ ควรเปลี่ยนเร็วๆ นี้"
    },
    {
      id: "3",
      date: "2023-06-15",
      activityType: "measure",
      tireId: "T011",
      vehicleId: "2",
      mileage: 32000,
      cost: 0,
      description: "วัดความลึกดอกยางตามระยะเวลา",
      performedBy: "นายสมบัติ",
      measurementValue: 9.8, // ความลึกดอกยาง (มม.)
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
    { id: "T001", name: "BDG2021060001 (Bridgestone 11R22.5)" },
    { id: "T002", name: "BDG2021060002 (Bridgestone 11R22.5)" },
    { id: "T003", name: "BDG2021060003 (Bridgestone 11R22.5)" },
    { id: "T011", name: "MCH2022010015 (Michelin 11R22.5)" },
  ];

  // เกณฑ์ความลึกดอกยางต่ำสุดที่ปลอดภัย (มม.)
  const minimumSafeTreadDepth = 5.0;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">บันทึกการวัดความลึกดอกยาง</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              บันทึกการวัดความลึกดอกยางใหม่
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[625px]">
            <DialogHeader>
              <DialogTitle>บันทึกการวัดความลึกดอกยาง</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="date">วันที่วัด</Label>
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
                <div className="grid gap-2">
                  <Label htmlFor="treadDepth">ความลึกดอกยาง (มม.)</Label>
                  <Input id="treadDepth" type="number" step="0.1" placeholder="เช่น 8.5" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="mileage">เลขไมล์ (กม.)</Label>
                  <Input id="mileage" type="number" placeholder="เช่น 35000" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="performedBy">ผู้วัด</Label>
                  <Input id="performedBy" placeholder="เช่น นายสมบัติ" />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">จุดประสงค์การวัด</Label>
                <Input id="description" placeholder="เช่น วัดความลึกดอกยางตามระยะเวลา" />
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
          <CardTitle>ประวัติการวัดความลึกดอกยาง</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>วันที่</TableHead>
                <TableHead>รถ/ยาง</TableHead>
                <TableHead>ความลึกดอกยาง</TableHead>
                <TableHead>เลขไมล์</TableHead>
                <TableHead>ผู้วัด</TableHead>
                <TableHead>สถานะ</TableHead>
                <TableHead className="text-right">รายละเอียด</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {measurements.map((measurement) => {
                const isBelowThreshold = measurement.measurementValue < minimumSafeTreadDepth;
                
                return (
                  <TableRow key={measurement.id}>
                    <TableCell>{measurement.date}</TableCell>
                    <TableCell>
                      {vehicles.find(v => v.id === measurement.vehicleId)?.name.split(" ")[0]} / 
                      {tires.find(t => t.id === measurement.tireId)?.name.split(" ")[0]}
                    </TableCell>
                    <TableCell>
                      <span className={isBelowThreshold ? "text-red-600 font-semibold" : ""}>
                        {measurement.measurementValue.toFixed(1)} มม.
                      </span>
                    </TableCell>
                    <TableCell>{measurement.mileage.toLocaleString()} กม.</TableCell>
                    <TableCell>{measurement.performedBy}</TableCell>
                    <TableCell>
                      {isBelowThreshold ? (
                        <div className="flex items-center text-red-600">
                          <AlertTriangle className="h-4 w-4 mr-1" />
                          <span>ต่ำกว่าเกณฑ์</span>
                        </div>
                      ) : (
                        <span className="text-green-600">ปกติ</span>
                      )}
                    </TableCell>
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

export default TreadDepthMeasurement;
