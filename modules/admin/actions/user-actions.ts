import { createAction } from "@/lib/server/actionFactory"
import { UserManagementService } from "../services/user-management-service"
import { updateUserRoleSchema, blockUserSchema, unblockUserSchema } from "../validators"

export const updateUserRoleAction = createAction(
  updateUserRoleSchema,
  async (input, context) => {
    if (!context.user || context.user.role !== "admin") {
      return { success: false, error: "Admin access required" }
    }

    try {
      const user = await UserManagementService.updateUserRole(input.userId, input.role, context.user.id, {
        reason: input.reason,
      })

      if (!user) {
        return { success: false, error: "User not found" }
      }

      return { success: true, data: user }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to update user role",
      }
    }
  },
  { requireAuth: true, requireRole: "admin" },
)

export const blockUserAction = createAction(
  blockUserSchema,
  async (input, context) => {
    if (!context.user || context.user.role !== "admin") {
      return { success: false, error: "Admin access required" }
    }

    try {
      const user = await UserManagementService.blockUser(input.userId, context.user.id, input.reason)

      if (!user) {
        return { success: false, error: "User not found" }
      }

      return { success: true, data: user }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to block user",
      }
    }
  },
  { requireAuth: true, requireRole: "admin" },
)

export const unblockUserAction = createAction(
  unblockUserSchema,
  async (input, context) => {
    if (!context.user || context.user.role !== "admin") {
      return { success: false, error: "Admin access required" }
    }

    try {
      const user = await UserManagementService.unblockUser(input.userId, context.user.id, input.reason)

      if (!user) {
        return { success: false, error: "User not found" }
      }

      return { success: true, data: user }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to unblock user",
      }
    }
  },
  { requireAuth: true, requireRole: "admin" },
)
