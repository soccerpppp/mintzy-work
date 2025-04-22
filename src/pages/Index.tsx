import { useState } from "react";
import { Truck, BarChart4, Wrench, FileText, Home, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";

const Index = () => {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState<string>("home");

  const menuItems = [
    {
      id: "home",
      title: "หน้าหลัก",
      icon: <Home className="h-6 w-6" />,
      description: "กลับไปยังหน้าหลัก",
      onClick: () => setActiveMenu("home"),
    },
    {
      id: "master-data",
      title: "ข้อมูลหลัก",
      icon: <Truck className="h-6 w-6" />,
      description: "จัดการข้อมูลรถและยาง",
      onClick: () => navigate("/master-data"),
    },
    {
      id: "daily-activities",
      title: "กิจกรรมประจำวัน",
      icon: <Wrench className="h-6 w-6" />,
      description: "บันทึกการซ่อม เปลี่ยน และหมุนยาง",
      onClick: () => navigate("/daily-activities"),
    },
    {
      id: "reports",
      title: "รายงาน",
      icon: <BarChart4 className="h-6 w-6" />,
      description: "รายงานสถานะและประวัติยาง",
      onClick: () => navigate("/reports"),
    },
    {
      id: "documents",
      title: "เอกสาร",
      icon: <FileText className="h-6 w-6" />,
      description: "จัดการเอกสารที่เกี่ยวข้อง",
      onClick: () => navigate("/documents"),
    },
    {
      id: "realtime-calculation",
      title: "คำนวณการสึกหรอของยาง",
      icon: <Clock className="h-6 w-6" />,
      description: "วิเคราะห์การสึกหรอของยาง",
      onClick: () => navigate("/realtime-calculation"),
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-primary shadow-md">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-white">ระบบจัดการยางรถบรรทุก</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {activeMenu === "home" ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {menuItems.slice(1).map((item) => (
                <Card
                  key={item.id}
                  className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-primary"
                  onClick={item.onClick}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="bg-primary/10 p-3 rounded-lg">
                        {item.icon}
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold">{item.title}</h2>
                        <p className="text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-12">
              <h2 className="text-xl font-semibold mb-4">ภาพรวมระบบ</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-medium">จำนวนรถทั้งหมด</h3>
                    <p className="text-3xl font-bold mt-2">0</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-medium">จำนวนยางทั้งหมด</h3>
                    <p className="text-3xl font-bold mt-2">0</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-medium">ยางที่ต้องตรวจสอบ</h3>
                    <p className="text-3xl font-bold mt-2 text-red-500">0</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </>
        ) : null}
      </main>
    </div>
  );
};

export default Index;
