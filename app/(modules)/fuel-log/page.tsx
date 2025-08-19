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
  Plus,
  TrendingUp,
  Wrench,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function FuelLogDashboard() {
  const { user, isLoaded } = useUser();
  const [stats, setStats] = useState<any>({
    totalVehicles: 0,
    totalFuelCost: 0,
    totalServiceCost: 0,
    totalVolume: 0,
    totalDistance: 0,
    averageMileage: 0,
    bestMileage: 0,
    currentMileage: 0,
    recentEntries: [],
  });
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Calculate mileage from fuel log entries
  const calculateMileage = (entries: any[]) => {
    if (entries.length < 2) return 0;

    // Sort by date and calculate mileage between entries
    const sortedEntries = entries.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    let totalMileage = 0;
    let validEntries = 0;

    for (let i = 1; i < sortedEntries.length; i++) {
      const current = sortedEntries[i];
      const previous = sortedEntries[i - 1];
      const distance = current.odometer - previous.odometer;

      if (distance > 0 && current.volume > 0) {
        const mileage = distance / current.volume; // km/L
        totalMileage += mileage;
        validEntries++;
      }
    }

    return validEntries > 0 ? totalMileage / validEntries : 0;
  };

  useEffect(() => {
    if (isLoaded && user) {
      // Simulate API call with mileage-focused data
      setTimeout(() => {
        const mockEntries = [
          {
            id: 1,
            vehicle: "Honda Civic",
            type: "fuel",
            date: "2024-01-15",
            amount: 3200, // ৳3200
            volume: 40, // 40L
            odometer: 45200,
            details: "40L, Shell Petrol Station",
            mileage: 12.5, // km/L
          },
          {
            id: 2,
            vehicle: "Royal Enfield",
            type: "fuel",
            date: "2024-01-12",
            amount: 800, // ৳800
            volume: 10, // 10L
            odometer: 12800,
            details: "10L, HP Petrol Pump",
            mileage: 35.0, // km/L
          },
          {
            id: 3,
            vehicle: "Honda Civic",
            type: "service",
            date: "2024-01-10",
            amount: 6500, // ৳6500
            details: "Engine oil change + filter",
          },
        ];

        setStats({
          totalVehicles: 2,
          totalFuelCost: 4000, // ৳4000
          totalServiceCost: 6500, // ৳6500
          totalVolume: 50, // 50L
          totalDistance: 1250, // 1250 KM
          averageMileage: 18.2, // km/L
          bestMileage: 35.0, // km/L (bike)
          currentMileage: 12.5, // km/L (recent)
          recentEntries: mockEntries,
        });

        // Mileage trend data
        setChartData([
          { month: "Jan", mileage: 16.8, fuelCost: 2800, distance: 890 },
          { month: "Feb", mileage: 17.2, fuelCost: 3200, distance: 980 },
          { month: "Mar", mileage: 18.5, fuelCost: 3100, distance: 1050 },
          { month: "Apr", mileage: 17.9, fuelCost: 3400, distance: 1120 },
          { month: "May", mileage: 18.8, fuelCost: 3300, distance: 1200 },
          { month: "Jun", mileage: 18.2, fuelCost: 3500, distance: 1250 },
        ]);
        setLoading(false);
      }, 1000);
    }
  }, [isLoaded, user]);

  if (!isLoaded || loading) {
    return null;
  }

  return (
    <div className="space-y-8 p-6">
      {/* Header with Actions */}
      <div className="bg-gradient-to-br from-teal-500 to-blue-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Fuel Mileage Tracker</h1>
            <p className="text-teal-100 text-lg">
              Monitor your vehicle's fuel efficiency and track every kilometer
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              asChild
              className="bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm"
            >
              <Link href="/fuel-log/add-entry">
                <Plus className="mr-2 h-4 w-4" />
                Add Fuel Entry
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-teal-600 bg-transparent backdrop-blur-sm"
            >
              <Link href="/fuel-log/vehicles">Manage Vehicles</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Mileage-focused Stats */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Average Mileage"
          value={`${stats.averageMileage} km/L`}
          description="Overall fuel efficiency"
          icon={Gauge}
          trend={{
            value: 5.2,
            label: "vs last month",
            isPositive: true,
          }}
          className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900"
        />
        <StatCard
          title="Best Mileage"
          value={`${stats.bestMileage} km/L`}
          description="Your most efficient vehicle"
          icon={TrendingUp}
          className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900"
        />
        <StatCard
          title="Total Distance"
          value={`${stats.totalDistance.toLocaleString()} KM`}
          description="Distance covered this month"
          icon={BarChart3}
          className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900"
        />
        <StatCard
          title="Fuel Cost"
          value={`৳${stats.totalFuelCost.toLocaleString()}`}
          description="Total fuel expenses"
          icon={DollarSign}
          trend={{
            value: -8.3,
            label: "vs last month",
            isPositive: true,
          }}
          className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900"
        />
      </div>

      {/* Charts */}
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
              <LineChart data={chartData}>
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
              <BarChart3 className="h-5 w-5 text-blue-500" />
              Distance vs Cost
            </CardTitle>
            <CardDescription>
              Monthly distance covered and fuel costs
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
                    name === "distance"
                      ? `${Number(value)} KM`
                      : `৳${Number(value).toLocaleString()}`,
                    name === "distance" ? "Distance" : "Fuel Cost",
                  ]}
                />
                <Bar
                  yAxisId="left"
                  dataKey="distance"
                  fill="#3b82f6"
                  radius={[4, 4, 0, 0]}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="fuelCost"
                  stroke="#f59e0b"
                  strokeWidth={2}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Fuel Entries */}
      <Card className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Recent Fuel Entries</CardTitle>
          <CardDescription>Latest fill-ups and mileage data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.recentEntries.length === 0 ? (
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
              stats.recentEntries.map((entry: any) => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`p-2 rounded-full ${entry.type === "fuel" ? "bg-green-100 dark:bg-green-900" : "bg-orange-100 dark:bg-orange-900"}`}
                    >
                      {entry.type === "fuel" ? (
                        <Fuel className="h-4 w-4 text-green-600 dark:text-green-400" />
                      ) : (
                        <Wrench className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{entry.vehicle}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(entry.date).toLocaleDateString()} •{" "}
                        {entry.details}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      ৳{entry.amount.toLocaleString()}
                    </p>
                    {entry.mileage && (
                      <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                        {entry.mileage} km/L
                      </p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Mileage Calculator */}
      <Card className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gauge className="h-5 w-5 text-teal-500" />
            Quick Mileage Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
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
        </CardContent>
      </Card>
    </div>
  );
}
