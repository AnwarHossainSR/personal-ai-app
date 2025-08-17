import { AppLayout } from "@/components/layout/app-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { StatCard } from "@/components/ui/stat-card"
import { ChartWrapper } from "@/components/ui/chart-wrapper"
import { getAuthUser } from "@/lib/auth/jwt"
import { VehicleService } from "@/modules/fuel-log/services/vehicle-service"
import { FuelLogService } from "@/modules/fuel-log/services/fuel-log-service"
import { ServiceLogService } from "@/modules/fuel-log/services/service-log-service"
import { Car, Fuel, Wrench, DollarSign } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"

export default async function FuelLogDashboard() {
  const user = await getAuthUser()
  if (!user) return null

  const [vehicles, fuelLogs, serviceLogs] = await Promise.all([
    VehicleService.getAll(user.userId),
    FuelLogService.getAll(user.userId),
    ServiceLogService.getAll(user.userId),
  ])

  // Calculate summary stats
  const totalFuelCost = fuelLogs.reduce((sum, log) => sum + log.total_cost, 0)
  const totalServiceCost = serviceLogs.reduce((sum, log) => sum + log.cost, 0)
  const totalVolume = fuelLogs.reduce((sum, log) => sum + log.volume, 0)

  // Prepare chart data
  const monthlyData = fuelLogs.reduce(
    (acc, log) => {
      const month = new Date(log.date).toLocaleDateString("en-US", { year: "numeric", month: "short" })
      if (!acc[month]) {
        acc[month] = { month, fuelCost: 0, volume: 0 }
      }
      acc[month].fuelCost += log.total_cost
      acc[month].volume += log.volume
      return acc
    },
    {} as Record<string, any>,
  )

  const chartData = Object.values(monthlyData).slice(-6) // Last 6 months

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Fuel Log Dashboard</h1>
          <p className="text-muted-foreground">Track your vehicle fuel consumption and maintenance costs.</p>
        </div>

        {/* Summary Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Total Vehicles" value={vehicles.length} description="Registered vehicles" icon={Car} />
          <StatCard
            title="Fuel Cost"
            value={`$${totalFuelCost.toFixed(2)}`}
            description="Total fuel expenses"
            icon={Fuel}
          />
          <StatCard
            title="Service Cost"
            value={`$${totalServiceCost.toFixed(2)}`}
            description="Total service expenses"
            icon={Wrench}
          />
          <StatCard
            title="Total Cost"
            value={`$${(totalFuelCost + totalServiceCost).toFixed(2)}`}
            description="All vehicle expenses"
            icon={DollarSign}
          />
        </div>

        {/* Charts */}
        <div className="grid gap-4 md:grid-cols-2">
          <ChartWrapper title="Monthly Fuel Costs" description="Fuel expenses over the last 6 months">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${Number(value).toFixed(2)}`, "Fuel Cost"]} />
                <Bar dataKey="fuelCost" fill="hsl(var(--chart-1))" />
              </BarChart>
            </ResponsiveContainer>
          </ChartWrapper>

          <ChartWrapper title="Monthly Fuel Volume" description="Fuel consumption over the last 6 months">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`${Number(value).toFixed(1)} gal`, "Volume"]} />
                <Line type="monotone" dataKey="volume" stroke="hsl(var(--chart-2))" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </ChartWrapper>
        </div>

        {/* Recent Activity */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Fuel Entries</CardTitle>
              <CardDescription>Latest fuel fill-ups</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {fuelLogs.slice(0, 5).map((log) => {
                  const vehicle = vehicles.find((v) => v._id.toString() === log.vehicle_id)
                  return (
                    <div key={log._id.toString()} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{vehicle?.name || "Unknown Vehicle"}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(log.date).toLocaleDateString()} • {log.volume} gal
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${log.total_cost.toFixed(2)}</p>
                        <p className="text-sm text-muted-foreground">${log.unit_price.toFixed(2)}/gal</p>
                      </div>
                    </div>
                  )
                })}
                {fuelLogs.length === 0 && <p className="text-muted-foreground text-center py-4">No fuel entries yet</p>}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Service</CardTitle>
              <CardDescription>Latest maintenance records</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {serviceLogs.slice(0, 5).map((log) => {
                  const vehicle = vehicles.find((v) => v._id.toString() === log.vehicle_id)
                  return (
                    <div key={log._id.toString()} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{vehicle?.name || "Unknown Vehicle"}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(log.date).toLocaleDateString()} • {log.service_type.replace("_", " ")}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${log.cost.toFixed(2)}</p>
                      </div>
                    </div>
                  )
                })}
                {serviceLogs.length === 0 && (
                  <p className="text-muted-foreground text-center py-4">No service records yet</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  )
}
