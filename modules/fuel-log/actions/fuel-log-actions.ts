"use server";

import { createAction } from "@/lib/server/actionFactory";
import { extractUserId } from "@/lib/utils";
import { FuelLogService } from "@/modules/fuel-log/services/fuel-log-service";
import {
  createFuelLogSchema,
  deleteFuelLogSchema,
  getFuelLogsSchema,
  getFuelLogStatsSchema,
  updateFuelLogSchema,
} from "../validators";

export const createFuelLogAction = createAction(
  createFuelLogSchema,
  async (input, context) => {
    if (!context.user) {
      return { success: false, error: "Authentication required" };
    }

    const userId = extractUserId(context.user.id);

    try {
      // Convert date string to Date object
      const fuelLogData = {
        ...input,
        date: new Date(input.date),
        created_at: new Date(),
        updated_at: new Date(),
      };

      const fuelLog = await FuelLogService.create(fuelLogData, userId);

      // Ensure the fuel log data is properly serialized
      const serializedFuelLog = JSON.parse(JSON.stringify(fuelLog));

      return { success: true, data: serializedFuelLog };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to create fuel log",
      };
    }
  },
  { requireAuth: true }
);

export const updateFuelLogAction = createAction(
  updateFuelLogSchema,
  async (input, context) => {
    if (!context.user) {
      return { success: false, error: "Authentication required" };
    }

    const userId = extractUserId(context.user.id);

    try {
      const { id, ...data } = input;

      // Convert date string to Date object if provided
      const updateData = {
        ...data,
        ...(data.date && { date: new Date(data.date) }),
        updated_at: new Date(),
      };

      const fuelLog = await FuelLogService.update(id, userId, updateData);

      if (!fuelLog) {
        return { success: false, error: "Fuel log not found" };
      }

      // Ensure the fuel log data is properly serialized
      const serializedFuelLog = JSON.parse(JSON.stringify(fuelLog));

      return { success: true, data: serializedFuelLog };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to update fuel log",
      };
    }
  },
  { requireAuth: true }
);

export const deleteFuelLogAction = createAction(
  deleteFuelLogSchema,
  async (input, context) => {
    if (!context.user) {
      return { success: false, error: "Authentication required" };
    }

    const userId = extractUserId(context.user.id);

    try {
      const success = await FuelLogService.delete(input.id, userId);

      if (!success) {
        return { success: false, error: "Fuel log not found" };
      }

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to delete fuel log",
      };
    }
  },
  { requireAuth: true }
);

export const getFuelLogsAction = createAction(
  getFuelLogsSchema,
  async (input, context) => {
    if (!context.user) {
      return { success: false, error: "Authentication required" };
    }

    const userId = extractUserId(context.user.id);

    try {
      // Convert date strings to Date objects
      const serviceFilters = {
        ...(input.vehicleId && { vehicleId: input.vehicleId }),
        ...(input.startDate && { startDate: new Date(input.startDate) }),
        ...(input.endDate && { endDate: new Date(input.endDate) }),
        ...(input.station && { station: input.station }),
      };

      const fuelLogs = await FuelLogService.getAll(userId, serviceFilters);

      // Ensure the fuel logs data is properly serialized
      const serializedFuelLogs = JSON.parse(JSON.stringify(fuelLogs));

      return { success: true, data: serializedFuelLogs };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to fetch fuel logs",
      };
    }
  },
  { requireAuth: true }
);

export const getFuelLogStatsAction = createAction(
  getFuelLogStatsSchema, // No input validation needed for stats
  async (input, context) => {
    if (!context.user) {
      return { success: false, error: "Authentication required" };
    }

    const userId = extractUserId(context.user.id);

    try {
      const fuelLogs = await FuelLogService.getAll(userId);

      // Calculate stats
      const totalCost = fuelLogs.reduce((sum, log) => sum + log.total_cost, 0);
      const totalVolume = fuelLogs.reduce((sum, log) => sum + log.volume, 0);
      const totalFillUps = fuelLogs.length;

      // Calculate distance and mileage
      const sortedLogs = fuelLogs.sort((a, b) => {
        if (a.vehicle_id !== b.vehicle_id) {
          return a.vehicle_id.localeCompare(b.vehicle_id);
        }
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      });

      let totalDistance = 0;
      let totalMileageReadings = 0;
      let mileageSum = 0;
      let bestMileage = 0;
      let worstMileage = Number.MAX_VALUE;

      for (let i = 0; i < sortedLogs.length; i++) {
        const currentLog = sortedLogs[i];

        // Find previous log for same vehicle
        const prevLog = sortedLogs
          .slice(0, i)
          .reverse()
          .find((log) => log.vehicle_id === currentLog.vehicle_id);

        if (prevLog) {
          const distance = currentLog.odometer - prevLog.odometer;
          if (distance > 0) {
            totalDistance += distance;
            const mileage = distance / currentLog.volume;
            if (mileage > 0) {
              mileageSum += mileage;
              totalMileageReadings++;
              bestMileage = Math.max(bestMileage, mileage);
              worstMileage = Math.min(worstMileage, mileage);
            }
          }
        }
      }

      const averageMileage =
        totalMileageReadings > 0 ? mileageSum / totalMileageReadings : 0;
      const averagePrice = totalVolume > 0 ? totalCost / totalVolume : 0;
      const costPerKm = totalDistance > 0 ? totalCost / totalDistance : 0;

      // Calculate monthly average based on the time span of logs
      const monthlyAverage =
        fuelLogs.length > 0
          ? totalCost /
            Math.max(
              1,
              Math.ceil(
                (Date.now() -
                  new Date(
                    fuelLogs[fuelLogs.length - 1]?.date || Date.now()
                  ).getTime()) /
                  (30 * 24 * 60 * 60 * 1000)
              )
            )
          : 0;

      const stats = {
        totalCost,
        totalVolume,
        totalFillUps,
        totalDistance,
        averageMileage,
        averagePrice,
        costPerKm,
        monthlyAverage,
        bestMileage: bestMileage === 0 ? 0 : bestMileage,
        worstMileage: worstMileage === Number.MAX_VALUE ? 0 : worstMileage,
      };

      return { success: true, data: stats };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to calculate fuel log statistics",
      };
    }
  },
  { requireAuth: true }
);

// Type exports for client-side usage
export type {
  CreateFuelLogInput,
  GetFuelLogsInput,
  UpdateFuelLogInput,
} from "../validators";
