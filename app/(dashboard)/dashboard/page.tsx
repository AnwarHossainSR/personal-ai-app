import { AppLayout } from "@/components/layout/app-layout"
import { getAuthUser } from "@/lib/auth/clerk-helpers"
import { getModulesForRole } from "@/modules/registry"
import { FuelLogSummaryWidget, FuelLogChartWidget } from "@/components/dashboard/fuel-log-widgets"
import { StatCard } from "@/components/ui/stat-card"
import { Activity, Users, Zap, TrendingUp } from "lucide-react"
import { UserManagementService } from "@/modules/admin/services/user-management-service"

export default async function DashboardPage() {
  const user = await getAuthUser()
  if (!user) return null

  const modules = getModulesForRole(user.role)

  // Get system stats for admin users
  let systemStats = null
  if (user.role === "admin") {
    systemStats = await UserManagementService.getUserStats()
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's an overview of your modules and recent activity.</p>
        </div>

        {/* System Stats for Admins */}
        {user.role === "admin" && systemStats && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Total Users"
              value={systemStats.totalUsers}
              description="Registered users"
              icon={Users}
              trend={{
                value: 12,
                label: "from last month",
                isPositive: true,
              }}
            />
            <StatCard
              title="Active Users"
              value={systemStats.activeUsers}
              description="Non-blocked users"
              icon={Activity}
            />
            <StatCard title="Active Modules" value={modules.length} description="Available modules" icon={Zap} />
            <StatCard
              title="System Health"
              value="98.5%"
              description="Uptime this month"
              icon={TrendingUp}
              trend={{
                value: 2.1,
                label: "from last month",
                isPositive: true,
              }}
            />
          </div>
        )}

        {/* Module Widgets Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* Fuel Log Widgets */}
          <FuelLogSummaryWidget userId={user.userId} />
          <FuelLogChartWidget userId={user.userId} />

          {/* Module Overview Cards */}
          {modules.map((module) => (
            <div key={module.id} className="col-span-1">
              <StatCard
                title={module.name}
                value={module.routes.length}
                description={`${module.description}`}
                icon={module.icon}
              />
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Actions</h3>
            <div className="grid gap-2">
              {modules.slice(0, 3).map((module) => (
                <a
                  key={module.id}
                  href={module.routes[0]?.path || "#"}
                  className="flex items-center gap-3 p-3 rounded-lg border hover:bg-accent transition-colors"
                >
                  <module.icon className="h-5 w-5" />
                  <div>
                    <p className="font-medium">{module.name}</p>
                    <p className="text-sm text-muted-foreground">{module.description}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Recent Activity</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                <div>
                  <p className="text-sm font-medium">System Status: Online</p>
                  <p className="text-xs text-muted-foreground">All systems operational</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <div className="h-2 w-2 rounded-full bg-blue-500" />
                <div>
                  <p className="text-sm font-medium">Welcome to the Modular App</p>
                  <p className="text-xs text-muted-foreground">Explore the available modules</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
