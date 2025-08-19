"use server";

import { createAction } from "@/lib/server/actionFactory";
import { VehicleService } from "../services/vehicle-service";
import { vehicleSchema } from "../validators";

export const createVehicleAction = createAction(
  vehicleSchema,
  async (input, context) => {
    if (!context.user) {
      return { success: false, error: "Authentication required" };
    }

    console.log("context.user", context.user);

    try {
      const vehicle = await VehicleService.create(input, context.user.id);

      // Ensure the vehicle data is properly serialized
      const serializedVehicle = JSON.parse(JSON.stringify(vehicle));

      return { success: true, data: serializedVehicle };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to create vehicle",
      };
    }
  },
  { requireAuth: true }
);

export const updateVehicleAction = createAction(
  vehicleSchema.extend({ id: vehicleSchema.shape.name }),
  async (input, context) => {
    if (!context.user) {
      return { success: false, error: "Authentication required" };
    }

    try {
      const { id, ...data } = input;
      const vehicle = await VehicleService.update(id, context.user.id, data);

      if (!vehicle) {
        return { success: false, error: "Vehicle not found" };
      }

      // Ensure the vehicle data is properly serialized
      const serializedVehicle = JSON.parse(JSON.stringify(vehicle));

      return { success: true, data: serializedVehicle };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to update vehicle",
      };
    }
  },
  { requireAuth: true }
);

export const deleteVehicleAction = createAction(
  vehicleSchema.pick({ name: true }).extend({ id: vehicleSchema.shape.name }),
  async (input, context) => {
    if (!context.user) {
      return { success: false, error: "Authentication required" };
    }

    try {
      const success = await VehicleService.delete(input.id, context.user.id);

      if (!success) {
        return { success: false, error: "Vehicle not found" };
      }

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to delete vehicle",
      };
    }
  },
  { requireAuth: true }
);
