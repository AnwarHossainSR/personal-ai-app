"use server";

import { currentUser } from "@clerk/nextjs/server";
import { UserManagementService } from "../services/user-management-service";
import {
  blockUserSchema,
  unblockUserSchema,
  updateUserRoleSchema,
} from "../validators";

export async function updateUserRoleClientAction(formData: FormData) {
  const user = await currentUser();

  if (!user || user.publicMetadata?.role !== "system_admintrator") {
    return { success: false, error: "Admin access required" };
  }

  try {
    const data = {
      userId: formData.get("userId") as string,
      role: formData.get("role") as "user" | "admin",
      reason: formData.get("reason") as string,
    };

    const validated = updateUserRoleSchema.safeParse(data);
    if (!validated.success) {
      return { success: false, error: "Invalid data provided" };
    }

    const updatedUser = await UserManagementService.updateUserRole(
      validated.data.userId,
      validated.data.role,
      user.id,
      { reason: validated.data.reason }
    );

    if (!updatedUser) {
      return { success: false, error: "User not found" };
    }

    return { success: true, data: updatedUser };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to update user role",
    };
  }
}

export async function blockUserClientAction(formData: FormData) {
  const user = await currentUser();

  if (!user || user.publicMetadata?.role !== "system_admintrator") {
    return { success: false, error: "Admin access required" };
  }

  try {
    const data = {
      userId: formData.get("userId") as string,
      reason: formData.get("reason") as string,
    };

    const validated = blockUserSchema.safeParse(data);
    if (!validated.success) {
      return { success: false, error: "Invalid data provided" };
    }

    const blockedUser = await UserManagementService.blockUser(
      validated.data.userId,
      user.id,
      validated.data.reason
    );

    if (!blockedUser) {
      return { success: false, error: "User not found" };
    }

    return { success: true, data: blockedUser };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to block user",
    };
  }
}

export async function unblockUserClientAction(formData: FormData) {
  const user = await currentUser();

  if (!user || user.publicMetadata?.role !== "system_admintrator") {
    return { success: false, error: "Admin access required" };
  }

  try {
    const data = {
      userId: formData.get("userId") as string,
      reason: formData.get("reason") as string,
    };

    const validated = unblockUserSchema.safeParse(data);
    if (!validated.success) {
      return { success: false, error: "Invalid data provided" };
    }

    const unblockedUser = await UserManagementService.unblockUser(
      validated.data.userId,
      user.id,
      validated.data.reason
    );

    if (!unblockedUser) {
      return { success: false, error: "User not found" };
    }

    return { success: true, data: unblockedUser };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to unblock user",
    };
  }
}
