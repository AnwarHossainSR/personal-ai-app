import { AppLayout } from "@/components/layout/app-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { getAuthUser } from "@/lib/auth/clerk-helpers"
import { ModuleManagementService } from "@/modules/admin/services/module-management-service"
import { moduleRegistry } from "@/modules/registry"
import { redirect } from "next/navigation"

export default async function ModulesManagementPage() {
  const user = await getAuthUser()
  if (!user || user.role !== "admin") {
    redirect("/dashboard")
  }

  const [moduleSettings, moduleStats] = await Promise.all([
    ModuleManagementService.getModuleSettings(),
    ModuleManagementService.getModuleUsageStats(),
  ])

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Module Management</h1>
          <p className="text-muted-foreground">Configure module settings and access permissions.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {moduleRegistry.map((module) => {
            const stats = moduleStats.find((s) => s.id === module.id)
            return (
              <Card key={module.id}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div className="flex items-center gap-2">
                    <module.icon className="h-5 w-5" />
                    <CardTitle className="text-base">{module.name}</CardTitle>
                  </div>
                  <Switch checked={module.enabled} />
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4">{module.description}</CardDescription>

                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium mb-1">Status</p>
                      <Badge variant={module.enabled ? "default" : "secondary"}>
                        {module.enabled ? "Enabled" : "Disabled"}
                      </Badge>
                    </div>

                    <div>
                      <p className="text-sm font-medium mb-1">Required Roles</p>
                      <div className="flex gap-1">
                        {module.requiredRoles.map((role) => (
                          <Badge key={role} variant="outline" className="text-xs">
                            {role}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium mb-1">Routes</p>
                      <p className="text-sm text-muted-foreground">{module.routes.length} pages</p>
                    </div>

                    {stats && (
                      <div>
                        <p className="text-sm font-medium mb-1">Usage</p>
                        <p className="text-sm text-muted-foreground">{stats.userCount} active users</p>
                        <p className="text-xs text-muted-foreground">
                          Last used: {new Date(stats.lastUsed).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </AppLayout>
  )
}
