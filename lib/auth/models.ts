import { Schema } from "mongoose"
import { createModel, type BaseDocument } from "@/lib/db/modelFactory"
import bcrypt from "bcryptjs"

export interface IUser extends BaseDocument {
  email: string
  password: string
  full_name: string
  avatar_url?: string
  role: "user" | "admin"
  is_blocked: boolean
  email_verified: boolean
  email_verification_token?: string
  password_reset_token?: string
  password_reset_expires?: Date
  comparePassword(candidatePassword: string): Promise<boolean>
}

const userSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  full_name: {
    type: String,
    required: true,
    trim: true,
  },
  avatar_url: {
    type: String,
    default: null,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  is_blocked: {
    type: Boolean,
    default: false,
  },
  email_verified: {
    type: Boolean,
    default: false,
  },
  email_verification_token: {
    type: String,
    default: null,
  },
  password_reset_token: {
    type: String,
    default: null,
  },
  password_reset_expires: {
    type: Date,
    default: null,
  },
})

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next()

  try {
    const salt = await bcrypt.genSalt(12)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (error) {
    next(error as Error)
  }
})

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password)
}

// Remove password from JSON output
userSchema.methods.toJSON = function () {
  const userObject = this.toObject()
  delete userObject.password
  delete userObject.email_verification_token
  delete userObject.password_reset_token
  return userObject
}

export const User = createModel<IUser>("User", userSchema)
