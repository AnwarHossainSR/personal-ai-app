import { WidgetContainer } from "./widget-container"
import { VehicleService } from "@/modules/fuel-log/services/vehicle-service"
import { FuelLogService } from "@/modules/fuel-log/services/fuel-log-service"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface FuelLogWidgetsProps {
  userId: string
}

export async function FuelLogSummaryWidget({ userId }: FuelLogWidgetsProps) {
  const [vehicles, fuelLogs] = await Promise.all([VehicleService.getAll(userId), FuelLogService.getAll(userId)])

  const totalCost = fuelLogs.reduce((sum, log) => sum + log.total_cost, 0)
  const totalVolume = fuelLogs.reduce((sum, log) => sum + log.volume, 0)
  const avgEfficiency = totalVolume > 0 ? (totalCost / totalVolume).toFixed(2) : "0"

  return (
    <WidgetContainer title="Fuel Summary" description="Your fuel consumption overview">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="text-center">
          <div className="text-2xl font-bold">{vehicles.length}</div>
          <p className="text-xs text-muted-foreground">Vehicles</p>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold">${totalCost.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">Total Spent</p>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold">{totalVolume.toFixed(1)}</div>
          <p className="text-xs text-muted-foreground">Gallons</p>
        </div>
      </div>
    </WidgetContainer>
  )
}

export async function FuelLogChartWidget({ userId }: FuelLogWidgetsProps) {
  const fuelLogs = await FuelLogService.getAll(userId)

  // Group by month
  const monthlyData = fuelLogs.reduce(
    (acc, log) => {
      const month = new Date(log.date).toLocaleDateString("en-US", { year: "numeric", month: "short" })
      if (!acc[month]) {
        acc[month] = { month, cost: 0, volume: 0 }
      }
      acc[month].cost += log.total_cost
      acc[month].volume += log.volume
      return acc
    },
    {} as Record<string, any>,
  )

  const chartData = Object.values(monthlyData).slice(-6)

  return (
    <WidgetContainer title="Monthly Fuel Costs" description="Last 6 months" size="large">
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip formatter={(value) => [`$${Number(value).toFixed(2)}`, "Cost"]} />
          <Bar dataKey="cost" fill="hsl(var(--chart-1))" />
        </BarChart>
      </ResponsiveContainer>
    </WidgetContainer>
  )
}
