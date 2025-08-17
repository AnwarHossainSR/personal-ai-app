import type React from "react"
import type { LucideIcon } from "lucide-react"

export interface WidgetData {
  id: string
  title: string
  value: string | number
  description?: string
  icon?: LucideIcon
  trend?: {
    value: number
    label: string
    isPositive?: boolean
  }
  moduleId: string
  priority: number
}

export interface DashboardWidget {
  id: string
  moduleId: string
  title: string
  component: React.ComponentType<any>
  size: "small" | "medium" | "large"
  refreshInterval?: number
  requiredRole?: "user" | "admin"
}

export class WidgetRegistry {
  private static widgets: Map<string, DashboardWidget> = new Map()

  static register(widget: DashboardWidget) {
    this.widgets.set(widget.id, widget)
  }

  static getWidget(id: string): DashboardWidget | undefined {
    return this.widgets.get(id)
  }

  static getWidgetsForModule(moduleId: string): DashboardWidget[] {
    return Array.from(this.widgets.values()).filter((widget) => widget.moduleId === moduleId)
  }

  static getWidgetsForRole(role: "user" | "admin"): DashboardWidget[] {
    return Array.from(this.widgets.values()).filter((widget) => !widget.requiredRole || widget.requiredRole === role)
  }

  static getAllWidgets(): DashboardWidget[] {
    return Array.from(this.widgets.values())
  }
}
