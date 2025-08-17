import { Schema } from "mongoose"
import { createModel, type BaseDocument } from "@/lib/db/modelFactory"

export interface IFuelLog extends BaseDocument {
  vehicle_id: string
  user_id: string
  date: Date
  odometer: number
  volume: number
  unit_price: number
  total_cost: number
  station?: string
  notes?: string
}

const fuelLogSchema = new Schema<IFuelLog>({
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
  volume: {
    type: Number,
    required: true,
    min: 0,
  },
  unit_price: {
    type: Number,
    required: true,
    min: 0,
  },
  total_cost: {
    type: Number,
    required: true,
    min: 0,
  },
  station: {
    type: String,
    trim: true,
  },
  notes: {
    type: String,
    trim: true,
  },
})

// Compound indexes for efficient queries
fuelLogSchema.index({ user_id: 1, vehicle_id: 1, date: -1 })
fuelLogSchema.index({ user_id: 1, date: -1 })

export const FuelLog = createModel<IFuelLog>("FuelLog", fuelLogSchema)
