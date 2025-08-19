import { getAuthUser } from "@/lib/auth/clerk-helpers";
import { FuelLogService } from "@/modules/fuel-log/services/fuel-log-service";
import { fuelLogSchema } from "@/modules/fuel-log/validators";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getAuthUser();
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const fuelLog = await FuelLogService.getById(params.id, user.userId);
    if (!fuelLog) {
      return NextResponse.json(
        { error: "Fuel log not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: fuelLog });
  } catch (error) {
    console.error(`GET /api/fuel-logs/${params.id} error:`, error);
    return NextResponse.json(
      { error: "Failed to fetch fuel log" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getAuthUser();
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const validatedData = fuelLogSchema.parse(body);

    const fuelLog = await FuelLogService.update(params.id, user.userId, {
      ...validatedData,
      date: new Date(validatedData.date),
    });

    if (!fuelLog) {
      return NextResponse.json(
        { error: "Fuel log not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: fuelLog });
  } catch (error: any) {
    console.error(`PUT /api/fuel-logs/${params.id} error:`, error);

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

    return NextResponse.json(
      { error: "Failed to update fuel log" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getAuthUser();
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const deleted = await FuelLogService.delete(params.id, user.userId);
    if (!deleted) {
      return NextResponse.json(
        { error: "Fuel log not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Fuel log deleted successfully" });
  } catch (error) {
    console.error(`DELETE /api/fuel-logs/${params.id} error:`, error);
    return NextResponse.json(
      { error: "Failed to delete fuel log" },
      { status: 500 }
    );
  }
}
