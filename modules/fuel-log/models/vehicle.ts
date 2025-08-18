import { createModel } from "@/lib/db/modelFactory";
import { HydratedDocument, Schema } from "mongoose";

export interface IVehicle {
  id?: string; // Changed from _id to id (string for client-side use)
  user_id: string;
  name: string;
  type: "car" | "truck" | "motorcycle" | "other";
  make: string;
  vehicleModel: string;
  year: number;
  fuel_type: "Octane" | "gasoline" | "diesel" | "electric" | "hybrid";
  created_at?: Date;
  updated_at?: Date;
}

export type VehicleDocument = HydratedDocument<IVehicle>;

// Define schema with _id (MongoDB requires _id internally)
const vehicleSchema = new Schema<VehicleDocument>({
  _id: { type: Schema.Types.ObjectId, auto: true }, // MongoDB uses _id
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
  vehicleModel: {
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
    enum: ["Octane", "gasoline", "diesel", "electric", "hybrid"],
    required: true,
  },
});

// Transform _id to id in output
vehicleSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret.id = ret._id.toString(); // Convert ObjectId to string and rename to id
    delete ret._id; // Remove _id from output
    delete ret.__v; // Remove version key
    return ret;
  },
});

// Add compound index for user_id and name uniqueness
vehicleSchema.index({ user_id: 1, name: 1 }, { unique: true });

// Create the model
let Vehicle: ReturnType<typeof createModel<VehicleDocument>>;

try {
  Vehicle = createModel<VehicleDocument>("Vehicle", vehicleSchema);
} catch (error) {
  console.error("Error creating Vehicle model:", error);
  throw error;
}

export { Vehicle, vehicleSchema };
