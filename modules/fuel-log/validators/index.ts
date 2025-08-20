import { z } from "zod";

export const vehicleSchema = z.object({
  name: z.string().min(1, "Vehicle name is required"),
  type: z.enum(["car", "truck", "motorcycle", "other"]),
  make: z.string().min(1, "Make is required"),
  vehicleModel: z.string().min(1, "Model is required"),
  year: z
    .number()
    .min(1900, "Year must be greater than or equal to 1900")
    .max(
      new Date().getFullYear() + 1,
      `Year must be less than or equal to ${new Date().getFullYear() + 1}`
    ),
  fuel_type: z.enum(["octane", "gasoline", "diesel", "electric", "hybrid"]), // Added Octane
});

export const serviceLogSchema = z.object({
  vehicle_id: z.string().min(1, "Vehicle is required"),
  date: z.string().min(1, "Date is required"),
  odometer: z.number().min(0, "Odometer must be positive"),
  service_type: z.enum([
    "oil_change",
    "tire_rotation",
    "brake_service",
    "tune_up",
    "repair",
    "other",
  ]),
  cost: z.number().min(0, "Cost must be positive"),
  notes: z.string().optional(),
});

// Base fuel log schema
export const fuelLogSchema = z.object({
  vehicle_id: z.string().min(1, "Vehicle is required"),
  date: z.string().refine(
    (date) => {
      const parsedDate = new Date(date);
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      return !isNaN(parsedDate.getTime()) && parsedDate <= today;
    },
    {
      message: "Invalid date format or date cannot be in the future",
    }
  ),
  odometer: z.number().min(1, "Odometer reading must be greater than 0"),
  volume: z.number().min(0.1, "Volume must be at least 0.1 liters"),
  unit_price: z.number().min(0.01, "Unit price must be greater than 0"),
  total_cost: z.number().min(0.01, "Total cost must be greater than 0"),
  station: z
    .string()
    .max(100, "Station name must be 100 characters or less")
    .optional(),
  notes: z.string().max(500, "Notes must be 500 characters or less").optional(),
});

// Schema for creating fuel logs
export const createFuelLogSchema = fuelLogSchema;

// Schema for updating fuel logs
export const updateFuelLogSchema = fuelLogSchema.partial().extend({
  id: z.string().min(1, "Fuel log ID is required"),
});

// Schema for deleting fuel logs
export const deleteFuelLogSchema = z.object({
  id: z.string().min(1, "Fuel log ID is required"),
});

// Schema for filtering fuel logs
export const getFuelLogsSchema = z.object({
  vehicleId: z.string().optional(),
  startDate: z
    .string()
    .optional()
    .refine(
      (date) => {
        return !date || !isNaN(new Date(date).getTime());
      },
      {
        message: "Invalid start date format",
      }
    ),
  endDate: z
    .string()
    .optional()
    .refine(
      (date) => {
        return !date || !isNaN(new Date(date).getTime());
      },
      {
        message: "Invalid end date format",
      }
    ),
  station: z.string().optional(),
});

// Schema for fuel log statistics (no input needed)
export const getFuelLogStatsSchema = z.object({});

// Additional validation schemas for specific use cases
export const fuelLogIdSchema = z.object({
  id: z.string().min(1, "Fuel log ID is required"),
});

// Custom validation for odometer progression
export const validateOdometerProgression = (
  currentOdometer: number,
  previousOdometer?: number
) => {
  if (previousOdometer && currentOdometer < previousOdometer) {
    throw new Error("Odometer reading cannot be less than the previous entry");
  }
  return true;
};

// Custom validation for total cost calculation
export const validateTotalCost = (
  volume: number,
  unitPrice: number,
  totalCost: number,
  tolerance: number = 0.01
) => {
  const calculatedTotal = volume * unitPrice;
  const difference = Math.abs(totalCost - calculatedTotal);

  if (difference > tolerance) {
    console.warn(
      `Total cost mismatch: calculated ${calculatedTotal.toFixed(2)}, provided ${totalCost.toFixed(2)}`
    );
    // Return warning but don't throw error to allow manual override
    return {
      isValid: true,
      warning: `Calculated total (৳${calculatedTotal.toFixed(2)}) differs from entered total (৳${totalCost.toFixed(2)})`,
    };
  }

  return { isValid: true };
};

// Type exports
export type FuelLogInput = z.infer<typeof fuelLogSchema>;
export type CreateFuelLogInput = z.infer<typeof createFuelLogSchema>;
export type UpdateFuelLogInput = z.infer<typeof updateFuelLogSchema>;
export type DeleteFuelLogInput = z.infer<typeof deleteFuelLogSchema>;
export type GetFuelLogsInput = z.infer<typeof getFuelLogsSchema>;
export type GetFuelLogStatsInput = z.infer<typeof getFuelLogStatsSchema>;
export type VehicleInput = z.infer<typeof vehicleSchema>;
export type ServiceLogInput = z.infer<typeof serviceLogSchema>;
