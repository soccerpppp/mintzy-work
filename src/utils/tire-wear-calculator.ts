interface TireWearCalculationParams {
  tireId: string;
  vehicleId: string;
  currentMileage: number; // ระยะทางสะสม (y)
  treadDepth: number; // ความลึกดอกยางปัจจุบัน (ไม่ใช้ในการคำนวณหลัก)
  purchaseDate?: string;
  initialTreadDepth?: number; // ความลึกดอกยางตอนติดตั้ง (เช่น 20)
  vehicleWeightTon?: number; // น้ำหนักรถ (ตัน) (x) **ต้องส่งเข้ามา**
}

interface TireWearAnalysisResult {
  wearPercent: number;
  remainingTreadDepth: number;
  analysisMethod: string;
  analysisResult: string;
  recommendation: string;
  wearFormula: string;
  statusCode: 'normal' | 'warning' | 'critical';
}

const MIN_SAFE_TREAD_DEPTH = 1.6; // mm
const WARNING_TREAD_DEPTH = 4; // mm
const CAUTION_TREAD_DEPTH = 3; // mm

export const calculateTireWear = (params: TireWearCalculationParams): TireWearAnalysisResult & { predictedKmLeft?: number, predictedDaysLeft?: number } => {
  const initialTread = params.initialTreadDepth ?? 20; // สมมติ default 20 มม. ถ้าไม่ส่งมา
  const x = params.vehicleWeightTon ?? 22; // ถ้าไม่ส่งมาใช้ 22 ตัน (ตัวอย่าง)
  const y = params.currentMileage ?? 0;

  // Linear Regression
  const wearPercent = 5 + 1.2 * x + 0.004 * y;

  // แปลงเปอร์เซ็นต์เป็นค่าความลึกที่สึกหรอไป (จาก treadDepth)
  const wearDepth = (params.treadDepth * wearPercent) / 100;

  // ความลึกดอกยางที่เหลือ = ความลึกดอกยางที่ user กรอก - ค่าที่สึกหรอไป
  const remainingTreadDepth = +(params.treadDepth - wearDepth).toFixed(2);

  // คำนวณระยะทางและจำนวนวันที่เหลือก่อนถึง MIN_SAFE_TREAD_DEPTH
  let predictedKmLeft: number | undefined = undefined;
  let predictedDaysLeft: number | undefined = undefined;
  if (remainingTreadDepth > MIN_SAFE_TREAD_DEPTH && params.currentMileage > 0) {
    // อัตราการสึกหรอ (มม./กม.)
    const usedDepth = params.treadDepth - remainingTreadDepth;
    const wearRatePerKm = usedDepth / params.currentMileage;
    // ระยะทางที่เหลือก่อนถึง MIN_SAFE_TREAD_DEPTH
    predictedKmLeft = +( (remainingTreadDepth - MIN_SAFE_TREAD_DEPTH) / (wearRatePerKm || 1e-6) ).toFixed(0);
    // สมมติวิ่งเฉลี่ยเท่ากับ params.currentMileage / 1 (วัน) หรือให้ user กรอกเอง (ที่นี่ใช้ params.currentMileage ต่อ 1 วัน)
    // ถ้า user กรอกระยะทางสะสม ให้สมมติว่าเป็นระยะทางต่อวัน
    const avgKmPerDay = params.currentMileage > 0 ? params.currentMileage : 200;
    predictedDaysLeft = avgKmPerDay > 0 ? Math.max(0, Math.round(predictedKmLeft / avgKmPerDay)) : undefined;
  }

  // วิเคราะห์สถานะ
  let statusCode: 'normal' | 'warning' | 'critical' = 'normal';
  let analysisResult = '';
  let recommendation = '';

  if (remainingTreadDepth <= MIN_SAFE_TREAD_DEPTH) {
    statusCode = 'critical';
    analysisResult = 'ความลึกดอกยางต่ำกว่า 1.6 มม.';
    recommendation = 'ควรเปลี่ยนยางทันที ห้ามนำรถออกใช้งาน';
  } else if (remainingTreadDepth <= CAUTION_TREAD_DEPTH) {
    statusCode = 'warning';
    analysisResult = 'ความลึกดอกยางอยู่ในช่วง 1.6-3 มม.';
    recommendation = 'ควรเปลี่ยนยางโดยเร็ว';
  } else if (remainingTreadDepth <= WARNING_TREAD_DEPTH) {
    statusCode = 'warning';
    analysisResult = 'ความลึกดอกยางอยู่ในช่วง 3-4 มม.';
    recommendation = 'เริ่มวางแผนเปลี่ยนยางได้แล้ว';
  } else {
    statusCode = 'normal';
    analysisResult = 'ความลึกดอกยางมากกว่า 4 มม.';
    recommendation = 'ยังไม่ต้องเปลี่ยนยาง';
  }

  const wearFormula = `Y = 5 + 1.2×${x} + 0.004×${y} = ${wearPercent.toFixed(2)}% | ดอกยางเหลือ ≈ ${remainingTreadDepth} มม.`;

  return {
    wearPercent: +wearPercent.toFixed(2),
    remainingTreadDepth,
    analysisMethod: 'Linear Regression (Y = 5 + 1.2x + 0.004y)',
    analysisResult,
    recommendation,
    wearFormula,
    statusCode,
    predictedKmLeft,
    predictedDaysLeft
  };
};
