
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";

const Documents = () => {
  const navigate = useNavigate();
  
  // ตัวอย่างข้อมูลเอกสาร
  const documents = [
    { id: 1, name: "คู่มือการใช้งานระบบ", type: "PDF", date: "2023-06-15", size: "2.4 MB" },
    { id: 2, name: "มาตรฐานการตรวจสอบยาง", type: "PDF", date: "2023-05-10", size: "1.8 MB" },
    { id: 3, name: "แบบฟอร์มบันทึกการซ่อมยาง", type: "XLSX", date: "2023-07-01", size: "0.5 MB" },
    { id: 4, name: "มาตรฐานความลึกดอกยาง", type: "PDF", date: "2023-04-22", size: "1.2 MB" },
    { id: 5, name: "รายงานสรุปประจำปี 2022", type: "PPTX", date: "2023-01-15", size: "4.6 MB" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-primary shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              className="mr-4 text-white" 
              onClick={() => navigate("/")}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold text-white">เอกสาร</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>เอกสารทั้งหมด</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ชื่อเอกสาร</TableHead>
                  <TableHead>ประเภท</TableHead>
                  <TableHead>วันที่อัปโหลด</TableHead>
                  <TableHead>ขนาด</TableHead>
                  <TableHead className="text-right">การดำเนินการ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documents.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell className="font-medium">{doc.name}</TableCell>
                    <TableCell>{doc.type}</TableCell>
                    <TableCell>{doc.date}</TableCell>
                    <TableCell>{doc.size}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm">ดาวน์โหลด</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Documents;
