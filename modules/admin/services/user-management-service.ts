import { User, type IUser } from "@/lib/auth/models"
import { AuditLog, type IAuditLog } from "../models/audit-log"
import dbConnect from "@/lib/db/connection"

export interface UserStats {
  totalUsers: number
  activeUsers: number
  blockedUsers: number
  adminUsers: number
  recentSignups: number
}

export class UserManagementService {
  static async getAllUsers(filters?: {
    role?: "user" | "admin"
    isBlocked?: boolean
    search?: string
  }): Promise<IUser[]> {
    await dbConnect()

    const query: any = {}

    if (filters?.role) query.role = filters.role
    if (filters?.isBlocked !== undefined) query.is_blocked = filters.isBlocked
    if (filters?.search) {
      query.$or = [
        { email: { $regex: filters.search, $options: "i" } },
        { full_name: { $regex: filters.search, $options: "i" } },
      ]
    }

    return User.find(query).sort({ created_at: -1 })
  }

  static async getUserById(id: string): Promise<IUser | null> {
    await dbConnect()
    return User.findById(id)
  }

  static async updateUserRole(
    userId: string,
    newRole: "user" | "admin",
    adminId: string,
    auditDetails?: Record<string, any>,
  ): Promise<IUser | null> {
    await dbConnect()

    const user = await User.findById(userId)
    if (!user) return null

    const oldRole = user.role
    user.role = newRole
    await user.save()

    // Log audit trail
    await this.logAuditAction({
      user_id: userId,
      admin_id: adminId,
      action: "role_changed",
      target_user_id: userId,
      details: {
        oldRole,
        newRole,
        ...auditDetails,
      },
    })

    return user
  }

  static async blockUser(userId: string, adminId: string, reason?: string): Promise<IUser | null> {
    await dbConnect()

    const user = await User.findById(userId)
    if (!user) return null

    user.is_blocked = true
    await user.save()

    // Log audit trail
    await this.logAuditAction({
      user_id: userId,
      admin_id: adminId,
      action: "user_blocked",
      target_user_id: userId,
      details: {
        reason: reason || "No reason provided",
        blockedAt: new Date(),
      },
    })

    return user
  }

  static async unblockUser(userId: string, adminId: string, reason?: string): Promise<IUser | null> {
    await dbConnect()

    const user = await User.findById(userId)
    if (!user) return null

    user.is_blocked = false
    await user.save()

    // Log audit trail
    await this.logAuditAction({
      user_id: userId,
      admin_id: adminId,
      action: "user_unblocked",
      target_user_id: userId,
      details: {
        reason: reason || "No reason provided",
        unblockedAt: new Date(),
      },
    })

    return user
  }

  static async getUserStats(): Promise<UserStats> {
    await dbConnect()

    const [totalUsers, activeUsers, blockedUsers, adminUsers, recentSignups] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ is_blocked: false }),
      User.countDocuments({ is_blocked: true }),
      User.countDocuments({ role: "admin" }),
      User.countDocuments({
        created_at: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
      }),
    ])

    return {
      totalUsers,
      activeUsers,
      blockedUsers,
      adminUsers,
      recentSignups,
    }
  }

  static async getAuditLogs(filters?: {
    adminId?: string
    targetUserId?: string
    action?: string
    limit?: number
  }) {
    await dbConnect()

    const query: any = {}

    if (filters?.adminId) query.admin_id = filters.adminId
    if (filters?.targetUserId) query.target_user_id = filters.targetUserId
    if (filters?.action) query.action = filters.action

    return AuditLog.find(query)
      .sort({ created_at: -1 })
      .limit(filters?.limit || 100)
  }

  private static async logAuditAction(data: Partial<IAuditLog>) {
    await dbConnect()
    const auditLog = new AuditLog(data)
    await auditLog.save()
  }
}
