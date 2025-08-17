import { type LucideIcon, Car, Fuel, Wrench, BarChart3, Settings, Users, Shield } from "lucide-react"

export interface ModuleRoute {
  path: string
  label: string
  icon?: LucideIcon
  requireRole?: "user" | "admin"
}

export interface ModuleMetadata {
  id: string
  name: string
  description: string
  icon: LucideIcon
  version: string
  enabled: boolean
  requiredRoles: ("user" | "admin")[]
  routes: ModuleRoute[]
  featureFlags?: string[]
}

// Module registry - add new modules here
export const moduleRegistry: ModuleMetadata[] = [
  {
    id: "fuel-log",
    name: "Fuel Log",
    description: "Track vehicle fuel consumption and service records",
    icon: Fuel,
    version: "1.0.0",
    enabled: true,
    requiredRoles: ["user", "admin"],
    routes: [
      {
        path: "/fuel-log",
        label: "Dashboard",
        icon: BarChart3,
      },
      {
        path: "/fuel-log/vehicles",
        label: "Vehicles",
        icon: Car,
      },
      {
        path: "/fuel-log/fuel-entries",
        label: "Fuel Entries",
        icon: Fuel,
      },
      {
        path: "/fuel-log/service-entries",
        label: "Service Entries",
        icon: Wrench,
      },
      {
        path: "/fuel-log/reports",
        label: "Reports",
        icon: BarChart3,
      },
      {
        path: "/fuel-log/settings",
        label: "Settings",
        icon: Settings,
      },
    ],
  },
  {
    id: "admin",
    name: "Admin Panel",
    description: "User management and system administration",
    icon: Shield,
    version: "1.0.0",
    enabled: true,
    requiredRoles: ["admin"],
    routes: [
      {
        path: "/admin",
        label: "Dashboard",
        icon: BarChart3,
        requireRole: "admin",
      },
      {
        path: "/admin/users",
        label: "User Management",
        icon: Users,
        requireRole: "admin",
      },
      {
        path: "/admin/modules",
        label: "Module Settings",
        icon: Settings,
        requireRole: "admin",
      },
    ],
  },
]

// Helper functions
export function getEnabledModules(): ModuleMetadata[] {
  return moduleRegistry.filter((module) => module.enabled)
}

export function getModuleById(id: string): ModuleMetadata | undefined {
  return moduleRegistry.find((module) => module.id === id)
}

export function getModulesForRole(role: "user" | "admin"): ModuleMetadata[] {
  return getEnabledModules().filter((module) => module.requiredRoles.includes(role))
}

export function getRoutesForRole(role: "user" | "admin"): ModuleRoute[] {
  const modules = getModulesForRole(role)
  return modules.flatMap((module) => module.routes.filter((route) => !route.requireRole || route.requireRole === role))
}
