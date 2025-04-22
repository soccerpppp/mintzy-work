import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger 
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

interface Supplier {
  id: string;
  name: string;
  contact_person: string;
  phone: string;
  email: string;
  address: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

const emptyForm = {
  name: "",
  contact_person: "",
  phone: "",
  email: "",
  address: "",
  notes: ""
};

const SupplierManagement = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [dialog, setDialog] = useState<"add" | "edit" | "delete" | "bulkDelete" | null>(null);
  const [currentSupplier, setCurrentSupplier] = useState<Supplier | null>(null);
  const [formData, setFormData] = useState(emptyForm);

  const fetchSuppliers = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('suppliers')
        .select('*')
        .order('name', { ascending: true });
      
      if (error) throw error;
      setSuppliers(data || []);
    } catch (error: any) {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถดึงข้อมูลผู้จำหน่ายได้",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { 
    fetchSuppliers(); 
  }, []);

  const filteredSuppliers = suppliers.filter(supplier =>
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.contact_person.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (dialog === "edit" && currentSupplier) {
        const { error } = await supabase
          .from('suppliers')
          .update({
            ...formData,
            updated_at: new Date().toISOString()
          })
          .eq('id', currentSupplier.id);
        
        if (error) throw error;
        toast({ title: "บันทึกสำเร็จ", description: "อัปเดตข้อมูลผู้จำหน่ายเรียบร้อยแล้ว" });
      } else {
        const { error } = await supabase.from('suppliers').insert(formData);
        if (error) throw error;
        toast({ title: "บันทึกสำเร็จ", description: "เพิ่มข้อมูลผู้จำหน่ายใหม่เรียบร้อยแล้ว" });
      }
      fetchSuppliers();
      closeDialog();
    } catch (error: any) {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: error.message || "ไม่สามารถบันทึกข้อมูลได้",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (ids: string[]) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('suppliers')
        .delete()
        .in('id', ids);
      
      if (error) throw error;
      
      toast({
        title: "ลบสำเร็จ",
        description: `ลบข้อมูลผู้จำหน่าย ${ids.length} รายการเรียบร้อยแล้ว`
      });
      
      fetchSuppliers();
      setSelectedIds([]);
      closeDialog();
    } catch (error: any) {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: error.message || "ไม่สามารถลบข้อมูลได้",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleSelectAll = () => {
    setSelectedIds(prev => 
      prev.length === filteredSuppliers.length ? [] : filteredSuppliers.map(s => s.id)
    );
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const openDialog = (type: "add" | "edit" | "delete" | "bulkDelete", supplier?: Supplier) => {
    setDialog(type);
    if (type === "edit" && supplier) {
      setCurrentSupplier(supplier);
      setFormData({
        name: supplier.name,
        contact_person: supplier.contact_person,
        phone: supplier.phone,
        email: supplier.email,
        address: supplier.address,
        notes: supplier.notes || ""
      });
    } else if (type === "delete" && supplier) {
      setCurrentSupplier(supplier);
    } else {
      setFormData(emptyForm);
      setCurrentSupplier(null);
    }
  };

  const closeDialog = () => {
    setDialog(null);
    setFormData(emptyForm);
    setCurrentSupplier(null);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <div className="w-[300px]">
            <Input
              placeholder="ค้นหาตามชื่อหรือผู้ติดต่อ..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          {selectedIds.length > 0 && (
            <Button
              variant="destructive"
              onClick={() => setDialog("bulkDelete")}
            >
              ลบรายการที่เลือก ({selectedIds.length})
            </Button>
          )}
        </div>
        <Button onClick={() => openDialog("add")}>
          <Plus className="h-4 w-4 mr-2" />
          เพิ่มผู้จำหน่ายใหม่
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>รายการผู้จำหน่ายทั้งหมด</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">
                    <Checkbox
                      checked={selectedIds.length === filteredSuppliers.length && filteredSuppliers.length > 0}
                      onCheckedChange={toggleSelectAll}
                    />
                  </TableHead>
                  <TableHead>ชื่อบริษัท/ร้าน</TableHead>
                  <TableHead>ผู้ติดต่อ</TableHead>
                  <TableHead>เบอร์โทรศัพท์</TableHead>
                  <TableHead>อีเมล</TableHead>
                  <TableHead className="text-right">การดำเนินการ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSuppliers.map((supplier) => (
                  <TableRow key={supplier.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedIds.includes(supplier.id)}
                        onCheckedChange={() => toggleSelect(supplier.id)}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{supplier.name}</TableCell>
                    <TableCell>{supplier.contact_person}</TableCell>
                    <TableCell>{supplier.phone}</TableCell>
                    <TableCell>{supplier.email}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="icon" onClick={() => openDialog("edit", supplier)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" onClick={() => openDialog("delete", supplier)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={dialog === "add" || dialog === "edit"} onOpenChange={v => !v && closeDialog()}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>{dialog === "edit" ? "แก้ไขข้อมูลผู้จำหน่าย" : "เพิ่มข้อมูลผู้จำหน่ายใหม่"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">ชื่อบริษัท/ร้าน</Label>
              <Input
                id="name"
                placeholder="เช่น บริษัท ไทยบริดจสโตน จำกัด"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="contact_person">ชื่อผู้ติดต่อ</Label>
                <Input
                  id="contact_person"
                  placeholder="เช่น คุณสมชาย ใจดี"
                  value={formData.contact_person}
                  onChange={e => setFormData({ ...formData, contact_person: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">เบอร์โทรศัพท์</Label>
                <Input
                  id="phone"
                  placeholder="เช่น 02-123-4567"
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">อีเมล</Label>
              <Input
                id="email"
                type="email"
                placeholder="เช่น contact@example.com"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="address">ที่อยู่</Label>
              <Input
                id="address"
                placeholder="เช่น 123 ถนนพระราม 4 คลองเตย กรุงเทพฯ 10110"
                value={formData.address}
                onChange={e => setFormData({ ...formData, address: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="notes">หมายเหตุ</Label>
              <Input
                id="notes"
                placeholder="รายละเอียดเพิ่มเติม..."
                value={formData.notes}
                onChange={e => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={closeDialog}>ยกเลิก</Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    กำลังบันทึก...
                  </>
                ) : (
                  'บันทึก'
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={dialog === "delete"} onOpenChange={v => !v && closeDialog()}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>ยืนยันการลบข้อมูล</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>คุณต้องการลบข้อมูลผู้จำหน่าย {currentSupplier?.name} ใช่หรือไม่?</p>
            <p className="text-sm text-red-500 mt-2">การดำเนินการนี้ไม่สามารถเรียกคืนได้</p>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={closeDialog}>ยกเลิก</Button>
            <Button 
              variant="destructive" 
              onClick={() => currentSupplier && handleDelete([currentSupplier.id])}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  กำลังลบ...
                </>
              ) : (
                'ลบ'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Bulk Delete Confirmation Dialog */}
      <Dialog open={dialog === "bulkDelete"} onOpenChange={v => !v && closeDialog()}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>ยืนยันการลบข้อมูล</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>คุณต้องการลบข้อมูลผู้จำหน่ายที่เลือก {selectedIds.length} รายการ ใช่หรือไม่?</p>
            <p className="text-sm text-red-500 mt-2">การดำเนินการนี้ไม่สามารถเรียกคืนได้</p>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={closeDialog}>ยกเลิก</Button>
            <Button 
              variant="destructive" 
              onClick={() => handleDelete(selectedIds)}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  กำลังลบ...
                </>
              ) : (
                'ลบ'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SupplierManagement;
