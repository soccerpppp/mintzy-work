
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import TireRepair from "@/components/daily-activities/TireRepair";
import TireChange from "@/components/daily-activities/TireChange";
import TireRotation from "@/components/daily-activities/TireRotation";
import TreadDepthMeasurement from "@/components/daily-activities/TreadDepthMeasurement";
import TireSale from "@/components/daily-activities/TireSale";
import TireInstallation from "@/components/daily-activities/TireInstallation";

const DailyActivities = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("repair");

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
            <h1 className="text-2xl font-bold text-white">กิจกรรมประจำวัน</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs 
          defaultValue="repair" 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-6 mb-8">
            <TabsTrigger value="repair">ซ่อมยาง</TabsTrigger>
            <TabsTrigger value="change">เปลี่ยนยาง</TabsTrigger>
            <TabsTrigger value="rotation">หมุนยาง</TabsTrigger>
            <TabsTrigger value="measurement">วัดความลึกดอกยาง</TabsTrigger>
            <TabsTrigger value="sale">ขายยาง</TabsTrigger>
            <TabsTrigger value="installation">ติดตั้งยาง</TabsTrigger>
          </TabsList>

          <TabsContent value="repair">
            <TireRepair />
          </TabsContent>

          <TabsContent value="change">
            <TireChange />
          </TabsContent>

          <TabsContent value="rotation">
            <TireRotation />
          </TabsContent>

          <TabsContent value="measurement">
            <TreadDepthMeasurement />
          </TabsContent>

          <TabsContent value="sale">
            <TireSale />
          </TabsContent>

          <TabsContent value="installation">
            <TireInstallation />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default DailyActivities;
