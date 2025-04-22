
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import TireHistory from "@/components/reports/TireHistory";
import VehicleTireStatus from "@/components/reports/VehicleTireStatus";
import RetreadingTracking from "@/components/reports/RetreadingTracking";
import TireAlerts from "@/components/reports/TireAlerts";

const Reports = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("history");

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
            <h1 className="text-2xl font-bold text-white">รายงาน</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs 
          defaultValue="history" 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="history">ประวัติยาง</TabsTrigger>
            <TabsTrigger value="status">สถานะยางรถ</TabsTrigger>
            <TabsTrigger value="retreading">การหล่อดอกยาง</TabsTrigger>
            <TabsTrigger value="alerts">แจ้งเตือน</TabsTrigger>
          </TabsList>

          <TabsContent value="history">
            <TireHistory />
          </TabsContent>

          <TabsContent value="status">
            <VehicleTireStatus />
          </TabsContent>

          <TabsContent value="retreading">
            <RetreadingTracking />
          </TabsContent>

          <TabsContent value="alerts">
            <TireAlerts />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Reports;
