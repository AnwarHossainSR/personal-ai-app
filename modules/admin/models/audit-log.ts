import { Schema } from "mongoose"
import { createModel, type BaseDocument } from "@/lib/db/modelFactory"

export interface IAuditLog extends BaseDocument {
  user_id: string
  admin_id: string
  action: "user_created" | "user_updated" | "user_blocked" | "user_unblocked" | "role_changed" | "module_toggled"
  target_user_id?: string
  details: Record<string, any>
  ip_address?: string
  user_agent?: string
}

const auditLogSchema = new Schema<IAuditLog>({
  user_id: {
    type: String,
    required: true,
    index: true,
  },
  admin_id: {
    type: String,
    required: true,
    index: true,
  },
  action: {
    type: String,
    enum: ["user_created", "user_updated", "user_blocked", "user_unblocked", "role_changed", "module_toggled"],
    required: true,
    index: true,
  },
  target_user_id: {
    type: String,
    index: true,
  },
  details: {
    type: Schema.Types.Mixed,
    required: true,
  },
  ip_address: {
    type: String,
  },
  user_agent: {
    type: String,
  },
})

// Compound indexes for efficient queries
auditLogSchema.index({ admin_id: 1, created_at: -1 })
auditLogSchema.index({ target_user_id: 1, created_at: -1 })
auditLogSchema.index({ action: 1, created_at: -1 })

export const AuditLog = createModel<IAuditLog>("AuditLog", auditLogSchema)
