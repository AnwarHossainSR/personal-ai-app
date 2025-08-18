import { VehicleService } from "@/modules/fuel-log/services/vehicle-service";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Replace with actual user ID from auth context
    const userId = "current-user-id";
    const vehicles = await VehicleService.getAll(userId);
    return NextResponse.json(vehicles);
  } catch (error) {
    console.error("Error fetching vehicles:", error);
    return NextResponse.json(
      { error: "Failed to fetch vehicles" },
      { status: 500 }
    );
  }
}
