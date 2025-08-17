import { Schema } from "mongoose"
import { createModel, type BaseDocument } from "@/lib/db/modelFactory"

export interface IVehicle extends BaseDocument {
  user_id: string
  name: string
  type: "car" | "truck" | "motorcycle" | "other"
  make: string
  model: string
  year: number
  fuel_type: "gasoline" | "diesel" | "electric" | "hybrid"
}

const vehicleSchema = new Schema<IVehicle>({
  user_id: {
    type: String,
    required: true,
    index: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  type: {
    type: String,
    enum: ["car", "truck", "motorcycle", "other"],
    required: true,
  },
  make: {
    type: String,
    required: true,
    trim: true,
  },
  model: {
    type: String,
    required: true,
    trim: true,
  },
  year: {
    type: Number,
    required: true,
    min: 1900,
    max: new Date().getFullYear() + 1,
  },
  fuel_type: {
    type: String,
    enum: ["gasoline", "diesel", "electric", "hybrid"],
    required: true,
  },
})

// Compound index for user queries
vehicleSchema.index({ user_id: 1, name: 1 })

export const Vehicle = createModel<IVehicle>("Vehicle", vehicleSchema)
