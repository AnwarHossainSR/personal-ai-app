import { getAuthUser } from "@/lib/auth/clerk-helpers";
import { FuelLogService } from "@/modules/fuel-log/services/fuel-log-service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const vehicleId = searchParams.get("vehicle_id") || undefined;

    const efficiencyData = await FuelLogService.getEfficiencyData(
      user.userId,
      vehicleId
    );

    return NextResponse.json({ data: efficiencyData });
  } catch (error) {
    console.error("GET /api/fuel-logs/efficiency error:", error);
    return NextResponse.json(
      { error: "Failed to fetch efficiency data" },
      { status: 500 }
    );
  }
}
// 01600322094
