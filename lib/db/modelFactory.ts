import mongoose, { type Document, type Model, type Schema } from "mongoose";

export interface BaseDocument extends Document {
  _id: mongoose.Types.ObjectId;
  created_at: Date;
  updated_at: Date;
  is_deleted?: boolean;
}

export interface ModelFactoryOptions {
  softDelete?: boolean;
  timestamps?: boolean;
  versionKey?: boolean;
}

export function createModel<T extends BaseDocument>(
  name: string,
  schema: Schema<T>,
  options: ModelFactoryOptions = {}
): Model<T> {
  const { softDelete = false, timestamps = true, versionKey = false } = options;

  // Add common fields
  if (timestamps) {
    schema.add({
      // @ts-expect-error
      created_at: { type: Date, default: Date.now },
      updated_at: { type: Date, default: Date.now },
    });
  }

  if (softDelete) {
    schema.add({
      // @ts-expect-error
      is_deleted: { type: Boolean, default: false },
    });
  }

  // Set schema options
  schema.set("versionKey", versionKey);
  schema.set("toJSON", { virtuals: true });
  schema.set("toObject", { virtuals: true });

  // Add pre-save middleware for updated_at
  if (timestamps) {
    schema.pre("save", function (next) {
      this.updated_at = new Date();
      next();
    });
  }

  // Add soft delete query helpers
  if (softDelete) {
    schema.pre(/^find/, function () {
      // @ts-expect-error
      this.where({ is_deleted: { $ne: true } });
    });
  }

  // Check if mongoose is connected and models object exists
  try {
    // Return existing model if it exists, otherwise create new one
    if (mongoose.models && mongoose.models[name]) {
      console.log("Model already exists:", name);
      return mongoose.models[name] as Model<T>;
    }
    console.log("Creating new model:", name);
    return mongoose.model<T>(name, schema);
  } catch (error) {
    // If there's an error (like mongoose not initialized), just create the model
    return mongoose.model<T>(name, schema);
  }
}
