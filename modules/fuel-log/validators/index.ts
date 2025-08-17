import { z } from "zod"

export const vehicleSchema = z.object({
  name: z.string().min(1, "Vehicle name is required"),
  type: z.enum(["car", "truck", "motorcycle", "other"]),
  make: z.string().min(1, "Make is required"),
  model: z.string().min(1, "Model is required"),
  year: z
    .number()
    .min(1900)
    .max(new Date().getFullYear() + 1),
  fuel_type: z.enum(["gasoline", "diesel", "electric", "hybrid"]),
})

export const fuelLogSchema = z.object({
  vehicle_id: z.string().min(1, "Vehicle is required"),
  date: z.string().min(1, "Date is required"),
  odometer: z.number().min(0, "Odometer must be positive"),
  volume: z.number().min(0, "Volume must be positive"),
  unit_price: z.number().min(0, "Unit price must be positive"),
  total_cost: z.number().min(0, "Total cost must be positive"),
  station: z.string().optional(),
  notes: z.string().optional(),
})

export const serviceLogSchema = z.object({
  vehicle_id: z.string().min(1, "Vehicle is required"),
  date: z.string().min(1, "Date is required"),
  odometer: z.number().min(0, "Odometer must be positive"),
  service_type: z.enum(["oil_change", "tire_rotation", "brake_service", "tune_up", "repair", "other"]),
  cost: z.number().min(0, "Cost must be positive"),
  notes: z.string().optional(),
})

export type VehicleInput = z.infer<typeof vehicleSchema>
export type FuelLogInput = z.infer<typeof fuelLogSchema>
export type ServiceLogInput = z.infer<typeof serviceLogSchema>
