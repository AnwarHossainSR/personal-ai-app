// app/api/fuel-logs/route.ts
import { getAuthUser } from "@/lib/auth/clerk-helpers";
import { FuelLogService } from "@/modules/fuel-log/services/fuel-log-service";
import { fuelLogSchema } from "@/modules/fuel-log/validators";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const vehicleId = searchParams.get("vehicle_id") || undefined;
    const startDate = searchParams.get("start_date");
    const endDate = searchParams.get("end_date");
    const station = searchParams.get("station") || undefined;

    const filters = {
      vehicleId,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      station,
    };

    const fuelLogs = await FuelLogService.getAll(user.userId, filters);
    return NextResponse.json({ data: fuelLogs });
  } catch (error) {
    console.error("GET /api/fuel-logs error:", error);
    return NextResponse.json(
      { error: "Failed to fetch fuel logs" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const validatedData = fuelLogSchema.parse(body);

    const fuelLog = await FuelLogService.create(
      {
        ...validatedData,
        date: new Date(validatedData.date),
      },
      user.userId
    );

    return NextResponse.json({ data: fuelLog }, { status: 201 });
  } catch (error) {
    console.error("POST /api/fuel-logs error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Validation failed",
          //@ts-expect-error
          details: error.errors,
        },
        { status: 400 }
      );
    }

    if (error instanceof Error && error.message.includes("Odometer")) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      { error: "Failed to create fuel log" },
      { status: 500 }
    );
  }
}
