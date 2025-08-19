import { getAuthUser } from "@/lib/auth/clerk-helpers";
import { VehicleService } from "@/modules/fuel-log/services/vehicle-service";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const user = await getAuthUser();
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const vehicles = await VehicleService.getAll(user.userId);
    return NextResponse.json(vehicles);
  } catch (error) {
    console.error("Error fetching vehicles:", error);
    return NextResponse.json(
      { error: "Failed to fetch vehicles" },
      { status: 500 }
    );
  }
}
