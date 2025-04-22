
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import VehicleManagement from "@/components/master-data/VehicleManagement";
import TireManagement from "@/components/master-data/TireManagement";
import SupplierManagement from "@/components/master-data/SupplierManagement";

const MasterData = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("vehicles");

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
            <h1 className="text-2xl font-bold text-white">ข้อมูลหลัก</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs 
          defaultValue="vehicles" 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="vehicles">ข้อมูลรถ</TabsTrigger>
            <TabsTrigger value="tires">ข้อมูลยาง</TabsTrigger>
            <TabsTrigger value="suppliers">ข้อมูลผู้จำหน่าย</TabsTrigger>
          </TabsList>

          <TabsContent value="vehicles">
            <VehicleManagement />
          </TabsContent>

          <TabsContent value="tires">
            <TireManagement />
          </TabsContent>

          <TabsContent value="suppliers">
            <SupplierManagement />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default MasterData;
