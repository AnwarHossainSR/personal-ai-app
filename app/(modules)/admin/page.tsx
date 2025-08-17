import { AppLayout } from "@/components/layout/app-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { StatCard } from "@/components/ui/stat-card"
import { ChartWrapper } from "@/components/ui/chart-wrapper"
import { getAuthUser } from "@/lib/auth/jwt"
import { UserManagementService } from "@/modules/admin/services/user-management-service"
import { ModuleManagementService } from "@/modules/admin/services/module-management-service"
import { Users, Shield, Activity, Settings } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { redirect } from "next/navigation"

export default async function AdminDashboard() {
  const user = await getAuthUser()
  if (!user || user.role !== "admin") {
    redirect("/dashboard")
  }

  const [userStats, moduleStats, auditLogs] = await Promise.all([
    UserManagementService.getUserStats(),
    ModuleManagementService.getModuleUsageStats(),
    UserManagementService.getAuditLogs({ limit: 10 }),
  ])

  // Prepare chart data
  const userDistributionData = [
    { name: "Active Users", value: userStats.activeUsers, color: "hsl(var(--chart-1))" },
    { name: "Blocked Users", value: userStats.blockedUsers, color: "hsl(var(--chart-2))" },
    { name: "Admin Users", value: userStats.adminUsers, color: "hsl(var(--chart-3))" },
  ]

  const moduleUsageData = moduleStats.map((module) => ({
    name: module.name,
    users: module.userCount,
    enabled: module.enabled,
  }))

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">System administration and user management overview.</p>
        </div>

        {/* Summary Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Users"
            value={userStats.totalUsers}
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
            value={userStats.activeUsers}
            description="Non-blocked users"
            icon={Activity}
          />
          <StatCard
            title="Blocked Users"
            value={userStats.blockedUsers}
            description="Blocked accounts"
            icon={Shield}
            trend={{
              value: -5,
              label: "from last month",
              isPositive: false,
            }}
          />
          <StatCard title="Recent Signups" value={userStats.recentSignups} description="Last 30 days" icon={Settings} />
        </div>

        {/* Charts */}
        <div className="grid gap-4 md:grid-cols-2">
          <ChartWrapper title="User Distribution" description="Breakdown of user types and status">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={userDistributionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {userDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </ChartWrapper>

          <ChartWrapper title="Module Usage" description="Active users per module">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={moduleUsageData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="users" fill="hsl(var(--chart-1))" />
              </BarChart>
            </ResponsiveContainer>
          </ChartWrapper>
        </div>

        {/* Recent Activity */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Admin Actions</CardTitle>
              <CardDescription>Latest administrative activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {auditLogs.map((log) => (
                  <div key={log._id.toString()} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium capitalize">{log.action.replace("_", " ")}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(log.created_at).toLocaleDateString()} • Admin: {log.admin_id}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">
                        {log.target_user_id ? `User: ${log.target_user_id.slice(-6)}` : "System"}
                      </p>
                    </div>
                  </div>
                ))}
                {auditLogs.length === 0 && (
                  <p className="text-muted-foreground text-center py-4">No recent admin actions</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>System Status</CardTitle>
              <CardDescription>Current system health and metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Database Status</span>
                  <span className="text-green-600 font-medium">Online</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Active Modules</span>
                  <span className="font-medium">
                    {moduleStats.filter((m) => m.enabled).length}/{moduleStats.length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>System Load</span>
                  <span className="text-green-600 font-medium">Normal</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Last Backup</span>
                  <span className="font-medium">2 hours ago</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  )
}
