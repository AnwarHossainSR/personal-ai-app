import { createModel, type BaseDocument } from "@/lib/db/modelFactory";
import { Schema } from "mongoose";

export interface IUser extends BaseDocument {
  email: string;
  full_name: string;
  avatar_url?: string;
  role: "user" | "system_administrator";
  is_blocked: boolean;
  clerk_id: string;
}

const userSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
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
  clerk_id: {
    type: String,
    required: true,
    unique: true,
  },
});

export const User = createModel<IUser>("User", userSchema);
