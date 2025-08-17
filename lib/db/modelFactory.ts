import mongoose, { type Schema, type Document, type Model } from "mongoose"

export interface BaseDocument extends Document {
  _id: mongoose.Types.ObjectId
  created_at: Date
  updated_at: Date
  is_deleted?: boolean
}

export interface ModelFactoryOptions {
  softDelete?: boolean
  timestamps?: boolean
  versionKey?: boolean
}

export function createModel<T extends BaseDocument>(
  name: string,
  schema: Schema<T>,
  options: ModelFactoryOptions = {},
): Model<T> {
  const { softDelete = false, timestamps = true, versionKey = false } = options

  // Add common fields
  if (timestamps) {
    schema.add({
      created_at: { type: Date, default: Date.now },
      updated_at: { type: Date, default: Date.now },
    })
  }

  if (softDelete) {
    schema.add({
      is_deleted: { type: Boolean, default: false },
    })
  }

  // Set schema options
  schema.set("versionKey", versionKey)
  schema.set("toJSON", { virtuals: true })
  schema.set("toObject", { virtuals: true })

  // Add pre-save middleware for updated_at
  if (timestamps) {
    schema.pre("save", function (next) {
      this.updated_at = new Date()
      next()
    })
  }

  // Add soft delete query helpers
  if (softDelete) {
    schema.pre(/^find/, function () {
      this.where({ is_deleted: { $ne: true } })
    })
  }

  // Return existing model if it exists, otherwise create new one
  return mongoose.models[name] || mongoose.model<T>(name, schema)
}
