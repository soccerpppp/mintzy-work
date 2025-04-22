
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

const TireSale = () => {
  // ตัวอย่างข้อมูลบันทึกการขายยาง
  const [sales, setSales] = useState<ActivityLog[]>([
    {
      id: "1",
      date: "2023-06-20",
      activityType: "sale",
      tireId: "T003",
      vehicleId: "1",
      mileage: 40000,
      cost: 0,
      description: "ขายยางที่หมดอายุการใช้งานแล้ว",
      performedBy: "นายสมบัติ",
      salePrice: 1500,
      buyer: "ร้านรับซื้อยางเก่า นครชัย",
      notes: "ยางใช้งานมาแล้ว 1 ปี"
    },
    {
      id: "2",
      date: "2023-06-25",
      activityType: "sale",
      tireId: "T012",
      vehicleId: "2",
      mileage: 38000,
      cost: 0,
      description: "ขายยางที่เสียหายจากอุบัติเหตุ",
      performedBy: "นายสมบัติ",
      salePrice: 800,
      buyer: "ร้านรับซื้อยางเก่า นครชัย",
      notes: "ยางเสียหายด้านข้าง"
    },
  ]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  // ตัวอย่างข้อมูลยางที่หมดอายุหรือถูกถอดออกแล้ว
  const expiredTires = [
    { id: "T003", name: "BDG2021060003 (Bridgestone 11R22.5) - หมดอายุ" },
    { id: "T012", name: "MCH2022010016 (Michelin 11R22.5) - เสียหาย" },
    { id: "T013", name: "BDG2021060013 (Bridgestone 11R22.5) - ดอกสึก" },
  ];

  // ตัวอย่างข้อมูลรถ
  const vehicles = [
    { id: "1", name: "70-8001 (HINO)" },
    { id: "2", name: "70-7520 (ISUZU)" },
  ];

  // ตัวอย่างข้อมูลร้านรับซื้อยางเก่า
  const buyers = [
    { id: "1", name: "ร้านรับซื้อยางเก่า นครชัย" },
    { id: "2", name: "บริษัท รีไซเคิลยาง จำกัด" },
    { id: "3", name: "ร้านวรเชษฐ์ยางเก่า" },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">บันทึกการขายยาง</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              บันทึกการขายยางใหม่
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[625px]">
            <DialogHeader>
              <DialogTitle>บันทึกการขายยาง</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="date">วันที่ขาย</Label>
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
                  <Label htmlFor="tire">ยางที่ขาย</Label>
                  <Select>
                    <SelectTrigger id="tire">
                      <SelectValue placeholder="เลือกยาง" />
                    </SelectTrigger>
                    <SelectContent>
                      {expiredTires.map(tire => (
                        <SelectItem key={tire.id} value={tire.id}>
                          {tire.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="buyer">ผู้ซื้อ</Label>
                  <Select>
                    <SelectTrigger id="buyer">
                      <SelectValue placeholder="เลือกผู้ซื้อ" />
                    </SelectTrigger>
                    <SelectContent>
                      {buyers.map(buyer => (
                        <SelectItem key={buyer.id} value={buyer.name}>
                          {buyer.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="salePrice">ราคาขาย (บาท)</Label>
                  <Input id="salePrice" type="number" placeholder="เช่น 1500" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="mileage">เลขไมล์สะสม (กม.)</Label>
                  <Input id="mileage" type="number" placeholder="เช่น 40000" />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="performedBy">ผู้ดำเนินการ</Label>
                <Input id="performedBy" placeholder="เช่น นายสมบัติ" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">สาเหตุการขาย</Label>
                <Textarea id="description" placeholder="บรรยายสาเหตุการขายยาง..." />
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
          <CardTitle>ประวัติการขายยาง</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>วันที่</TableHead>
                <TableHead>ยางที่ขาย</TableHead>
                <TableHead>ผู้ซื้อ</TableHead>
                <TableHead>ราคาขาย</TableHead>
                <TableHead>เลขไมล์สะสม</TableHead>
                <TableHead>สาเหตุการขาย</TableHead>
                <TableHead className="text-right">รายละเอียด</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sales.map((sale) => (
                <TableRow key={sale.id}>
                  <TableCell>{sale.date}</TableCell>
                  <TableCell>
                    {expiredTires.find(t => t.id === sale.tireId)?.name.split(" ")[0]}
                  </TableCell>
                  <TableCell>{sale.buyer}</TableCell>
                  <TableCell>{sale.salePrice?.toLocaleString()} บาท</TableCell>
                  <TableCell>{sale.mileage.toLocaleString()} กม.</TableCell>
                  <TableCell>{sale.description}</TableCell>
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

export default TireSale;
