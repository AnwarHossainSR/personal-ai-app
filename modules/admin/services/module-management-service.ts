import { moduleRegistry } from "@/modules/registry"
import { AuditLog } from "../models/audit-log"
import dbConnect from "@/lib/db/connection"

export interface ModuleSettings {
  id: string
  enabled: boolean
  allowedRoles: ("user" | "admin")[]
  featureFlags: string[]
}

export class ModuleManagementService {
  static async getModuleSettings(): Promise<ModuleSettings[]> {
    // In a real app, this would come from a database
    // For now, we'll use the registry as the source of truth
    return moduleRegistry.map((module) => ({
      id: module.id,
      enabled: module.enabled,
      allowedRoles: module.requiredRoles,
      featureFlags: module.featureFlags || [],
    }))
  }

  static async updateModuleSettings(
    moduleId: string,
    settings: Partial<ModuleSettings>,
    adminId: string,
  ): Promise<boolean> {
    await dbConnect()

    // In a real app, you would update the database
    // For this demo, we'll just log the action
    const module = moduleRegistry.find((m) => m.id === moduleId)
    if (!module) return false

    // Log audit trail
    const auditLog = new AuditLog({
      user_id: adminId,
      admin_id: adminId,
      action: "module_toggled",
      details: {
        moduleId,
        oldSettings: {
          enabled: module.enabled,
          allowedRoles: module.requiredRoles,
        },
        newSettings: settings,
        updatedAt: new Date(),
      },
    })

    await auditLog.save()

    // Update the module in registry (in memory for demo)
    if (settings.enabled !== undefined) module.enabled = settings.enabled
    if (settings.allowedRoles) module.requiredRoles = settings.allowedRoles

    return true
  }

  static async getModuleUsageStats() {
    await dbConnect()

    // This would typically query usage data from your analytics
    // For demo purposes, we'll return mock data
    return moduleRegistry.map((module) => ({
      id: module.id,
      name: module.name,
      enabled: module.enabled,
      userCount: Math.floor(Math.random() * 100) + 10,
      lastUsed: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
    }))
  }
}
