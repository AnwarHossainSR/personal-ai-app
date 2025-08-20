"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { useUser } from "@clerk/nextjs";
import {
  BarChart3,
  DollarSign,
  Fuel,
  Gauge,
  MapPin,
  PieChart,
  Plus,
} from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import {
  Bar,
  CartesianGrid,
  Cell,
  ComposedChart,
  Line,
  LineChart,
  Pie,
  PieChart as RechartsPieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// Import your actual hooks here
import { useFuelLogs } from "@/hooks/use-fuel-logs";
import { useVehicles } from "@/hooks/use-vehicles";

export default function FuelLogDashboard() {
  const { user, isLoaded } = useUser();

  // Use your actual hooks instead of mock data
  const { vehicles, loading: vehiclesLoading } = useVehicles();
  const { fuelLogs, loading: logsLoading, stats } = useFuelLogs();

  const loading = vehiclesLoading || logsLoading;

  // Calculate recent entries and enhanced stats
  const { recentEntries, chartData, vehicleDistribution, mileageTrend } =
    useMemo(() => {
      if (!fuelLogs || !Array.isArray(fuelLogs) || !vehicles) {
        return {
          recentEntries: [],
          chartData: [],
          vehicleDistribution: [],
          mileageTrend: [],
        };
      }

      // Get recent entries (last 5)
      const recent = fuelLogs
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5)
        .map((log) => {
          const vehicle = vehicles.find((v) => v.id === log.vehicle_id);

          // Calculate mileage for this entry
          const previousLog = fuelLogs
            .filter(
              (l) =>
                l.vehicle_id === log.vehicle_id &&
                new Date(l.date) < new Date(log.date)
            )
            .sort(
              (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
            )[0];

          let mileage = 0;
          if (previousLog) {
            const distance = log.odometer - previousLog.odometer;
            if (distance > 0 && log.volume > 0) {
              mileage = distance / log.volume;
            }
          }

          return {
            id: log.id,
            vehicle: vehicle?.name || "Unknown Vehicle",
            type: "fuel",
            date: log.date,
            amount: log.total_cost,
            volume: log.volume,
            odometer: log.odometer,
            details: `${log.volume}L, ${log.station || "Unknown Station"}`,
            mileage: mileage,
            station: log.station,
            notes: log.notes,
          };
        });

      // Prepare monthly chart data for trends
      const monthlyData: any = {};
      fuelLogs.forEach((log) => {
        const monthKey = new Date(log.date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
        });

        if (!monthlyData[monthKey]) {
          monthlyData[monthKey] = {
            month: monthKey,
            totalCost: 0,
            totalVolume: 0,
            totalDistance: 0,
            entries: [],
          };
        }

        monthlyData[monthKey].totalCost += log.total_cost;
        monthlyData[monthKey].totalVolume += log.volume;
        monthlyData[monthKey].entries.push(log);
      });

      const chartDataCalc = Object.values(monthlyData)
        .sort(
          (a: any, b: any) =>
            new Date(a.month).getTime() - new Date(b.month).getTime()
        )
        .slice(-6) // Last 6 months
        .map((data: any) => {
          // Calculate average mileage for the month
          let totalMileage = 0;
          let mileageEntries = 0;

          data.entries.forEach((log: any) => {
            const previousLog = fuelLogs
              .filter(
                (l) =>
                  l.vehicle_id === log.vehicle_id &&
                  new Date(l.date) < new Date(log.date)
              )
              .sort(
                (a, b) =>
                  new Date(b.date).getTime() - new Date(a.date).getTime()
              )[0];

            if (previousLog) {
              const distance = log.odometer - previousLog.odometer;
              if (distance > 0 && log.volume > 0) {
                totalMileage += distance / log.volume;
                mileageEntries++;
              }
            }
          });

          return {
            ...data,
            mileage: mileageEntries > 0 ? totalMileage / mileageEntries : 0,
            fuelCost: data.totalCost,
            distance: data.totalDistance,
          };
        });

      // Vehicle distribution for pie chart
      const vehicleDistCalc = vehicles
        .map((vehicle) => {
          const vehicleLogs = fuelLogs.filter(
            (log) => log.vehicle_id === vehicle.id
          );
          const totalCost = vehicleLogs.reduce(
            (sum, log) => sum + log.total_cost,
            0
          );
          return {
            name: vehicle.name,
            value: totalCost,
            color: `hsl(${Math.abs(vehicle?.id?.charCodeAt(0) * 123) % 360}, 70%, 50%)`,
          };
        })
        .filter((item) => item.value > 0);

      return {
        recentEntries: recent,
        chartData: chartDataCalc,
        vehicleDistribution: vehicleDistCalc,
        mileageTrend: chartDataCalc,
      };
    }, [fuelLogs, vehicles]);

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="space-y-8 p-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-32 bg-slate-700 rounded-xl animate-pulse"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6">
      {stats && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Spent"
            value={`৳${stats.totalCost.toLocaleString()}`}
            description={`${stats.totalFillUps} fill-ups total`}
            icon={DollarSign}
            trend={{
              value: -8.3,
              label: "vs last month",
              isPositive: true,
            }}
            className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-red-900"
          />
          <StatCard
            title="Average Mileage"
            value={`${stats.averageMileage > 0 ? stats.averageMileage.toFixed(1) : "N/A"} km/L`}
            description={`Best: ${stats.bestMileage > 0 ? stats.bestMileage.toFixed(1) : "N/A"} km/L`}
            icon={Gauge}
            trend={{
              value: 5.2,
              label: "vs last month",
              isPositive: true,
            }}
            className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900"
          />
          <StatCard
            title="Avg Price/L"
            value={`৳${stats.averagePrice.toFixed(2)}`}
            description={`${stats.totalVolume.toFixed(1)}L total volume`}
            icon={Fuel}
            className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900"
          />
          <StatCard
            title="Cost per KM"
            value={`৳${stats.costPerKm > 0 ? stats.costPerKm.toFixed(2) : "N/A"}`}
            description={`${stats.totalDistance.toLocaleString()} KM total`}
            icon={BarChart3}
            className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900"
          />
        </div>
      )}

      {/* Enhanced Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gauge className="h-5 w-5 text-green-500" />
              Mileage Trend
            </CardTitle>
            <CardDescription>
              Your fuel efficiency over the last 6 months
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={mileageTrend.filter((d) => d.mileage > 0)}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip
                  formatter={(value, name) => [
                    name === "mileage"
                      ? `${Number(value).toFixed(1)} km/L`
                      : `৳${Number(value).toLocaleString()}`,
                    name === "mileage" ? "Mileage" : "Fuel Cost",
                  ]}
                />
                <Line
                  type="monotone"
                  dataKey="mileage"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5 text-blue-500" />
              Spending by Vehicle
            </CardTitle>
            <CardDescription>Total fuel costs breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <RechartsPieChart>
                <Pie
                  data={vehicleDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {vehicleDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [
                    `৳${Number(value).toLocaleString()}`,
                    "Amount",
                  ]}
                />
              </RechartsPieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {vehicleDistribution.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm font-medium">{item.name}</span>
                  <span className="text-sm text-muted-foreground ml-auto">
                    ৳{item.value.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Cost vs Distance Chart */}
      <Card className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-blue-500" />
            Monthly Fuel Costs & Volume
          </CardTitle>
          <CardDescription>
            Track your monthly fuel expenses and consumption patterns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip
                formatter={(value, name) => [
                  name === "totalVolume"
                    ? `${Number(value).toFixed(1)} L`
                    : `৳${Number(value).toLocaleString()}`,
                  name === "totalVolume" ? "Volume" : "Cost",
                ]}
              />
              <Bar
                yAxisId="left"
                dataKey="totalVolume"
                fill="#3b82f6"
                radius={[4, 4, 0, 0]}
                name="totalVolume"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="fuelCost"
                stroke="#f59e0b"
                strokeWidth={2}
                name="fuelCost"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Recent Fuel Entries */}
      <Card className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Fuel Entries</CardTitle>
              <CardDescription>
                Latest fill-ups and mileage data
              </CardDescription>
            </div>
            <Button asChild variant="outline">
              <Link href="/fuel-log/fuel-entries">View All Entries</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentEntries.length === 0 ? (
              <div className="text-center py-8">
                <Fuel className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  No fuel entries yet. Add your first entry to start tracking
                  mileage!
                </p>
                <Button asChild className="mt-4">
                  <Link href="/fuel-log/add-entry">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Fuel Entry
                  </Link>
                </Button>
              </div>
            ) : (
              recentEntries.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-full bg-green-100 dark:bg-green-900">
                      <Fuel className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="font-medium">{entry.vehicle}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(entry.date).toLocaleDateString()} •{" "}
                        {entry.details}
                      </p>
                      {entry.station && (
                        <div className="flex items-center gap-1 mt-1">
                          <MapPin className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            {entry.station}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      ৳{entry.amount.toLocaleString()}
                    </p>
                    {entry.mileage > 0 && (
                      <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                        {entry.mileage.toFixed(1)} km/L
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {entry.odometer.toLocaleString()} KM
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Mileage Tips */}
      <Card className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gauge className="h-5 w-5 text-teal-500" />
            Fuel Efficiency Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4 text-sm mb-6">
            <div className="p-4 bg-white dark:bg-slate-700 rounded-lg">
              <h4 className="font-semibold mb-2 text-green-600 dark:text-green-400">
                Excellent (20+ km/L)
              </h4>
              <p className="text-muted-foreground">
                Your vehicle is very fuel efficient. Great driving habits!
              </p>
            </div>
            <div className="p-4 bg-white dark:bg-slate-700 rounded-lg">
              <h4 className="font-semibold mb-2 text-orange-600 dark:text-orange-400">
                Average (12-20 km/L)
              </h4>
              <p className="text-muted-foreground">
                Room for improvement. Check tire pressure and driving style.
              </p>
            </div>
            <div className="p-4 bg-white dark:bg-slate-700 rounded-lg">
              <h4 className="font-semibold mb-2 text-red-600 dark:text-red-400">
                Poor (&lt;12 km/L)
              </h4>
              <p className="text-muted-foreground">
                Consider vehicle maintenance or more efficient driving habits.
              </p>
            </div>
          </div>

          {stats && (
            <div className="p-4 bg-white/40 dark:bg-slate-700/40 rounded-lg">
              <h4 className="font-semibold mb-2">Performance Summary</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div>
                  <span className="text-muted-foreground">
                    Monthly Average:
                  </span>
                  <p className="font-medium">
                    ৳{stats.monthlyAverage.toLocaleString()}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">
                    Cost per Fill-up:
                  </span>
                  <p className="font-medium">
                    ৳
                    {stats.totalFillUps > 0
                      ? (stats.totalCost / stats.totalFillUps).toLocaleString()
                      : "0"}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">
                    Avg Volume/Fill:
                  </span>
                  <p className="font-medium">
                    {stats.totalFillUps > 0
                      ? (stats.totalVolume / stats.totalFillUps).toFixed(1)
                      : "0"}
                    L
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Total Vehicles:</span>
                  <p className="font-medium">{vehicles?.length || 0}</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
