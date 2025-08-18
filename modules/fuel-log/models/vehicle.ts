import { createModel } from "@/lib/db/modelFactory";
import { HydratedDocument, Schema, Types } from "mongoose";

export interface IVehicle {
  id?: string; // String for client-side use
  user_id: string;
  name: string;
  type: "car" | "truck" | "motorcycle" | "other";
  make: string;
  vehicleModel: string;
  year: number;
  fuel_type: "Octane" | "gasoline" | "diesel" | "electric" | "hybrid";
  created_at: Date; // Required to match BaseDocument
  updated_at: Date; // Required to match BaseDocument
}

export type VehicleDocument = HydratedDocument<IVehicle>;

// Define schema with _id (MongoDB requires _id internally)
const vehicleSchema = new Schema<VehicleDocument>(
  {
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
  },
  {
    timestamps: true, // Automatically adds created_at and updated_at
    versionKey: false, // Disable __v field
  }
);

// Transform _id to id in output
vehicleSchema.set("toJSON", {
  transform: (
    _doc,
    ret: Partial<IVehicle & { _id: Types.ObjectId; __v?: number }>
  ) => {
    if (ret._id) {
      ret.id = ret._id.toString(); // Convert ObjectId to string and rename to id
      delete ret._id; // Safe to delete since _id exists
    }
    if (ret.__v !== undefined) {
      delete ret.__v; // Safe to delete if __v exists
    }
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
