"use client"

import { useEffect, useState } from "react"
import { useUser } from "@clerk/nextjs"
import { AppLayout } from "@/components/layout/app-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { StatCard } from "@/components/ui/stat-card"
import { Button } from "@/components/ui/button"
import { Car, Fuel, Wrench, DollarSign, Plus, TrendingUp } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"
import Link from "next/link"

export default function FuelLogDashboard() {
  const { user, isLoaded } = useUser()
  const [stats, setStats] = useState({
    totalVehicles: 0,
    totalFuelCost: 0,
    totalServiceCost: 0,
    totalVolume: 0,
    recentEntries: [],
  })
  const [chartData, setChartData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isLoaded && user) {
      // Simulate API call - replace with actual data fetching
      setTimeout(() => {
        setStats({
          totalVehicles: 3,
          totalFuelCost: 1247.5,
          totalServiceCost: 650.0,
          totalVolume: 285.2,
          recentEntries: [
            { id: 1, vehicle: "Honda Civic", type: "fuel", date: "2024-01-15", amount: 45.2, details: "12.5 gal" },
            {
              id: 2,
              vehicle: "Toyota Camry",
              type: "service",
              date: "2024-01-10",
              amount: 89.99,
              details: "Oil change",
            },
          ],
        })

        setChartData([
          { month: "Jan", fuelCost: 245, volume: 42.1 },
          { month: "Feb", fuelCost: 289, volume: 48.3 },
          { month: "Mar", fuelCost: 312, volume: 51.2 },
          { month: "Apr", fuelCost: 298, volume: 49.8 },
          { month: "May", fuelCost: 334, volume: 54.1 },
          { month: "Jun", fuelCost: 356, volume: 58.7 },
        ])
        setLoading(false)
      }, 1000)
    }
  }, [isLoaded, user])

  if (!isLoaded || loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="space-y-8 p-6">
        {/* Header with Actions */}
        <div className="bg-gradient-to-r from-teal-600 to-teal-700 rounded-2xl p-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Fuel Log Dashboard</h1>
              <p className="text-teal-100 text-lg">Track your vehicle fuel consumption and maintenance costs</p>
            </div>
            <div className="flex gap-3">
              <Button asChild className="bg-white text-teal-600 hover:bg-teal-50">
                <Link href="/fuel-log/vehicles/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Vehicle
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-teal-600 bg-transparent"
              >
                <Link href="/fuel-log/vehicles">View All Vehicles</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Vehicles"
            value={stats.totalVehicles}
            description="Registered vehicles"
            icon={Car}
            className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900"
          />
          <StatCard
            title="Fuel Cost"
            value={`$${stats.totalFuelCost.toFixed(2)}`}
            description="Total fuel expenses"
            icon={Fuel}
            className="bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-950 dark:to-teal-900"
          />
          <StatCard
            title="Service Cost"
            value={`$${stats.totalServiceCost.toFixed(2)}`}
            description="Total service expenses"
            icon={Wrench}
            className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900"
          />
          <StatCard
            title="Total Cost"
            value={`$${(stats.totalFuelCost + stats.totalServiceCost).toFixed(2)}`}
            description="All vehicle expenses"
            icon={DollarSign}
            className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900"
          />
        </div>

        {/* Charts */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-teal-500" />
                Monthly Fuel Costs
              </CardTitle>
              <CardDescription>Fuel expenses over the last 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${Number(value).toFixed(2)}`, "Fuel Cost"]} />
                  <Bar dataKey="fuelCost" fill="#0d9488" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-500" />
                Monthly Fuel Volume
              </CardTitle>
              <CardDescription>Fuel consumption over the last 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${Number(value).toFixed(1)} gal`, "Volume"]} />
                  <Line type="monotone" dataKey="volume" stroke="#3b82f6" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest fuel and service entries</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentEntries.length === 0 ? (
                <div className="text-center py-8">
                  <Car className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No entries yet. Add your first vehicle to get started!</p>
                  <Button asChild className="mt-4">
                    <Link href="/fuel-log/vehicles/new">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Vehicle
                    </Link>
                  </Button>
                </div>
              ) : (
                stats.recentEntries.map((entry: any) => (
                  <div
                    key={entry.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-full ${entry.type === "fuel" ? "bg-teal-100 dark:bg-teal-900" : "bg-orange-100 dark:bg-orange-900"}`}
                      >
                        {entry.type === "fuel" ? (
                          <Fuel className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                        ) : (
                          <Wrench className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{entry.vehicle}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(entry.date).toLocaleDateString()} • {entry.details}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${entry.amount.toFixed(2)}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
