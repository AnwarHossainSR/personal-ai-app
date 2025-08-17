import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface StatCardProps {
  title: string
  value: string | number
  description?: string
  icon?: LucideIcon
  trend?: {
    value: number
    label: string
    isPositive?: boolean
  }
  className?: string
}

export function StatCard({ title, value, description, icon: Icon, trend, className }: StatCardProps) {
  return (
    <Card className={cn("hover:shadow-lg transition-all duration-200 border-0", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-300">{title}</CardTitle>
        {Icon && <Icon className="h-5 w-5 text-teal-600 dark:text-teal-400" />}
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1">{value}</div>
        {description && <p className="text-sm text-slate-500 dark:text-slate-400">{description}</p>}
        {trend && (
          <div className="flex items-center mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
            <span
              className={cn(
                "text-sm font-semibold px-2 py-1 rounded-full",
                trend.isPositive !== false
                  ? "text-green-700 bg-green-100 dark:text-green-300 dark:bg-green-900/30"
                  : "text-red-700 bg-red-100 dark:text-red-300 dark:bg-red-900/30",
              )}
            >
              {trend.isPositive !== false ? "+" : ""}
              {trend.value}%
            </span>
            <span className="text-sm text-slate-500 dark:text-slate-400 ml-2">{trend.label}</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
