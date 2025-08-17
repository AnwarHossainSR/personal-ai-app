import { z } from "zod"

export const updateUserRoleSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  role: z.enum(["user", "admin"]),
  reason: z.string().optional(),
})

export const blockUserSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  reason: z.string().min(1, "Reason is required"),
})

export const unblockUserSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  reason: z.string().optional(),
})

export const moduleSettingsSchema = z.object({
  moduleId: z.string().min(1, "Module ID is required"),
  enabled: z.boolean().optional(),
  allowedRoles: z.array(z.enum(["user", "admin"])).optional(),
  featureFlags: z.array(z.string()).optional(),
})

export type UpdateUserRoleInput = z.infer<typeof updateUserRoleSchema>
export type BlockUserInput = z.infer<typeof blockUserSchema>
export type UnblockUserInput = z.infer<typeof unblockUserSchema>
export type ModuleSettingsInput = z.infer<typeof moduleSettingsSchema>
