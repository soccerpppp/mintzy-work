import React from 'react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { Tire, Vehicle } from "@/types/models";

interface TireWearCalculationFormProps {
  tires: Tire[];
  vehicles: Vehicle[];
  selectedTire: string;
  selectedVehicle: string;
  todayMileage: number;
  treadDepth: number;
  vehicleWeightTon: number;
  isSaving: boolean;
  onTireChange: (value: string) => void;
  onVehicleChange: (value: string) => void;
  onTreadDepthChange: (value: number) => void;
  onVehicleWeightTonChange: (value: number) => void;
  onCalculate: () => void;
  analysisType?: any;
  onAnalysisTypeChange?: any;
}

export function TireWearCalculationForm({
  tires,
  vehicles,
  selectedTire,
  selectedVehicle,
  todayMileage,
  treadDepth,
  vehicleWeightTon,
  isSaving,
  onTireChange,
  onVehicleChange,
  onTreadDepthChange,
  onVehicleWeightTonChange,
  onCalculate,
  analysisType,
  onAnalysisTypeChange
}: TireWearCalculationFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">วิเคราะห์การสึกหรอของยาง</CardTitle>
        <CardDescription>กรอกข้อมูลให้ครบถ้วนเพื่อคำนวณการสึกหรอ (Linear Regression)</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">เลือกยาง</label>
            <Select onValueChange={onTireChange} value={selectedTire}>
              <SelectTrigger>
                <SelectValue placeholder="เลือกยาง" />
              </SelectTrigger>
              <SelectContent>
                {tires.map(tire => (
                  <SelectItem key={tire.id} value={tire.id}>
                    {tire.brand} {tire.model} - {tire.serialNumber}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">เลือกยานพาหนะ</label>
            <Select onValueChange={onVehicleChange} value={selectedVehicle}>
              <SelectTrigger>
                <SelectValue placeholder="เลือกยานพาหนะ" />
              </SelectTrigger>
              <SelectContent>
                {vehicles.map(vehicle => (
                  <SelectItem key={vehicle.id} value={vehicle.id}>
                    {vehicle.brand} {vehicle.model} - {vehicle.registrationNumber}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ระยะทางวันนี้ (กม.)</label>
            <Input 
              type="number"
              value={todayMileage}
              readOnly
              tabIndex={-1}
              className="bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ความลึกดอกยาง (มม.)</label>
            <Input 
              type="number" 
              step="0.1"
              placeholder="กรอกความลึกดอกยาง" 
              value={treadDepth === 0 ? "" : treadDepth} 
              onChange={(e) => onTreadDepthChange(Number(e.target.value))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">น้ำหนักรถ (ตัน)</label>
            <Input 
              type="number" 
              step="0.1"
              placeholder="กรอกน้ำหนักรถ (ตัน)" 
              value={vehicleWeightTon === 0 ? "" : vehicleWeightTon}
              onChange={(e) => onVehicleWeightTonChange(Number(e.target.value))}
            />
          </div>

          <Button 
            onClick={onCalculate} 
            disabled={!selectedTire || !selectedVehicle || !todayMileage || !treadDepth || !vehicleWeightTon || isSaving}
            className="w-full"
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                กำลังบันทึก...
              </>
            ) : (
              'คำนวณการสึกหรอ'
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
