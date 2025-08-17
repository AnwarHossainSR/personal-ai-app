import { Schema } from "mongoose"
import { createModel, type BaseDocument } from "@/lib/db/modelFactory"

export interface IServiceLog extends BaseDocument {
  vehicle_id: string
  user_id: string
  date: Date
  odometer: number
  service_type: "oil_change" | "tire_rotation" | "brake_service" | "tune_up" | "repair" | "other"
  cost: number
  notes?: string
}

const serviceLogSchema = new Schema<IServiceLog>({
  vehicle_id: {
    type: String,
    required: true,
    index: true,
  },
  user_id: {
    type: String,
    required: true,
    index: true,
  },
  date: {
    type: Date,
    required: true,
    index: true,
  },
  odometer: {
    type: Number,
    required: true,
    min: 0,
  },
  service_type: {
    type: String,
    enum: ["oil_change", "tire_rotation", "brake_service", "tune_up", "repair", "other"],
    required: true,
  },
  cost: {
    type: Number,
    required: true,
    min: 0,
  },
  notes: {
    type: String,
    trim: true,
  },
})

// Compound indexes for efficient queries
serviceLogSchema.index({ user_id: 1, vehicle_id: 1, date: -1 })
serviceLogSchema.index({ user_id: 1, service_type: 1 })

export const ServiceLog = createModel<IServiceLog>("ServiceLog", serviceLogSchema)
