"use client";

import {
  ConfirmationDialog,
  useConfirmation,
} from "@/components/confirmation-dialog";
import { FuelLogModalForm } from "@/components/FuelLogModalForm";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useModal } from "@/components/ui/modal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BarChart3,
  Calendar,
  DollarSign,
  Download,
  Edit,
  Filter,
  Fuel,
  Gauge,
  MapPin,
  PieChart,
  Plus,
  Trash2,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";

import {
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart as RechartsPieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { FuelLog, useFuelLogs } from "@/hooks/use-fuel-logs";
import { useVehicles } from "@/hooks/use-vehicles";
import { IVehicle } from "@/modules/fuel-log/models/vehicle";

export default function FuelLogPage() {
  const [selectedVehicle, setSelectedVehicle] = useState<string>("all");
  const [selectedLog, setSelectedLog] = useState<FuelLog | null>(null);
  const [dateRange, setDateRange] = useState("all");

  // Custom hooks for data management
  const { vehicles, loading: vehiclesLoading } = useVehicles();
  const {
    fuelLogs,
    loading: logsLoading,
    stats,
    createFuelLog,
    updateFuelLog,
    deleteFuelLog,
    updateFilters,
  } = useFuelLogs();

  // Modal hooks
  const addModal = useModal();
  const editModal = useModal();
  const confirmation = useConfirmation();

  const loading = vehiclesLoading || logsLoading;

  const handleVehicleChange = (vehicleId: string) => {
    setSelectedVehicle(vehicleId);
    updateFilters({
      vehicle_id: vehicleId === "all" ? undefined : vehicleId,
    });
  };

  const handleDateRangeChange = (range: string) => {
    setDateRange(range);
    let startDate: string | undefined;

    if (range !== "all") {
      const days = parseInt(range);
      const date = new Date();
      date.setDate(date.getDate() - days);
      startDate = date.toISOString().split("T")[0];
    }

    updateFilters({
      vehicle_id: selectedVehicle === "all" ? undefined : selectedVehicle,
      start_date: startDate,
    });
  };

  const handleDelete = (log: FuelLog) => {
    const vehicle = vehicles.find((v) => v.id === log.vehicle_id);

    confirmation.confirm({
      title: "Delete Fuel Log",
      description: `Are you sure you want to delete this fuel log entry for ${vehicle?.name || "Unknown Vehicle"} from ${new Date(log.date).toLocaleDateString()}? This action cannot be undone.`,
      confirmText: "Delete Entry",
      cancelText: "Cancel",
      type: "danger",
      destructive: true,
      onConfirm: async () => {
        await deleteFuelLog(log.id);
      },
    });
  };

  const handleEdit = (log: FuelLog) => {
    setSelectedLog(log);
    editModal.openModal();
  };

  const handleExportData = () => {
    const csvContent = [
      [
        "Date",
        "Vehicle",
        "Odometer",
        "Volume (L)",
        "Price/L",
        "Total Cost",
        "Station",
        "Notes",
      ].join(","),
      ...fuelLogs.map((log) => {
        const vehicle = vehicles.find((v) => v.id === log.vehicle_id);
        return [
          log.date,
          `"${vehicle?.name || "Unknown"}"`,
          log.odometer,
          log.volume,
          log.unit_price,
          log.total_cost,
          `"${log.station || ""}"`,
          `"${log.notes || ""}"`,
        ].join(",");
      }),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `fuel-logs-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  // Prepare chart data with mileage calculation
  const chartData = fuelLogs
    ?.filter(
      (log) => selectedVehicle === "all" || log.vehicle_id === selectedVehicle
    )
    ?.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    ?.map((log, index, array) => {
      const vehicle = vehicles?.find((v: IVehicle) => v.id === log.vehicle_id);
      let mileage = 0;

      // Calculate mileage based on previous entry for same vehicle
      if (index > 0) {
        const prevLog = array
          .slice(0, index)
          .reverse()
          .find((prev) => prev.vehicle_id === log.vehicle_id);
        if (prevLog) {
          const distance = log.odometer - prevLog.odometer;
          if (distance > 0 && log.volume > 0) {
            mileage = distance / log.volume;
          }
        }
      }

      return {
        date: new Date(log.date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        mileage: mileage,
        cost: log.total_cost,
        price: log.unit_price,
        vehicle: vehicle?.name || "Unknown",
      };
    });

  const vehicleDistribution = vehicles
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="container mx-auto max-w-7xl">
          <div className="space-y-8 p-4 sm:p-6">
            {/* Header Skeleton */}
            <div className="bg-gradient-to-br from-teal-500 to-blue-600 rounded-2xl p-6 sm:p-8">
              <Skeleton className="h-10 w-64 mb-2 bg-white/20" />
              <Skeleton className="h-6 w-96 bg-white/10" />
            </div>

            {/* Stats Skeleton */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <Skeleton className="h-20 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Content Skeleton */}
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardContent className="p-6">
                  <Skeleton className="h-64 w-full" />
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <Skeleton className="h-64 w-full" />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto max-w-7xl">
        <div className="space-y-8 p-4 sm:p-6">
          {/* Header */}
          <div className="bg-gradient-to-br from-teal-500 to-blue-600 rounded-2xl p-6 sm:p-8 text-white">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold mb-2">
                  Fuel Entries
                </h1>
                <p className="text-teal-100 text-base sm:text-lg">
                  Detailed view of all your fuel consumption records
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  variant="ghost"
                  onClick={handleExportData}
                  className="bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm h-12 px-6"
                  disabled={fuelLogs.length === 0}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Export Data
                </Button>
                <Button
                  onClick={addModal.openModal}
                  className="bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm h-12 px-6"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Fuel Entry
                </Button>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Card className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-slate-200/50 dark:border-slate-700/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Filter className="h-5 w-5 text-slate-500" />
                  <Select
                    value={selectedVehicle}
                    onValueChange={handleVehicleChange}
                  >
                    <SelectTrigger className="w-48 border-0 bg-transparent">
                      <SelectValue placeholder="Select vehicle" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Vehicles</SelectItem>
                      {vehicles &&
                        vehicles?.map((vehicle: IVehicle) => (
                          <SelectItem key={vehicle.id} value={vehicle.id}>
                            {vehicle.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-slate-200/50 dark:border-slate-700/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-slate-500" />
                  <Select
                    value={dateRange}
                    onValueChange={handleDateRangeChange}
                  >
                    <SelectTrigger className="w-48 border-0 bg-transparent">
                      <SelectValue placeholder="Date range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Time</SelectItem>
                      <SelectItem value="30">Last 30 Days</SelectItem>
                      <SelectItem value="90">Last 3 Months</SelectItem>
                      <SelectItem value="365">Last Year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Statistics Cards */}
          {stats && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950/50 dark:to-red-900/50 backdrop-blur-sm border-red-200/50 dark:border-red-700/50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-red-700 dark:text-red-300">
                        Total Spent
                      </p>
                      <p className="text-2xl font-bold text-red-900 dark:text-red-100">
                        ৳{stats.totalCost.toLocaleString()}
                      </p>
                    </div>
                    <div className="p-3 bg-red-200/50 dark:bg-red-800/30 rounded-full">
                      <DollarSign className="h-6 w-6 text-red-600 dark:text-red-400" />
                    </div>
                  </div>
                  <div className="mt-2 flex items-center text-sm">
                    <span className="text-red-600 dark:text-red-400">
                      {stats.totalFillUps} fill-ups
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/50 dark:to-green-900/50 backdrop-blur-sm border-green-200/50 dark:border-green-700/50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-700 dark:text-green-300">
                        Avg Mileage
                      </p>
                      <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                        {stats.averageMileage > 0
                          ? stats.averageMileage.toFixed(1)
                          : "N/A"}{" "}
                        km/L
                      </p>
                    </div>
                    <div className="p-3 bg-green-200/50 dark:bg-green-800/30 rounded-full">
                      <Gauge className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                  </div>
                  <div className="mt-2 flex items-center text-sm">
                    <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                    <span className="text-green-600 dark:text-green-400">
                      {stats.bestMileage > 0
                        ? `Best: ${stats.bestMileage.toFixed(1)} km/L`
                        : "No data"}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/50 backdrop-blur-sm border-blue-200/50 dark:border-blue-700/50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
                        Avg Price/L
                      </p>
                      <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                        ৳{stats.averagePrice.toFixed(2)}
                      </p>
                    </div>
                    <div className="p-3 bg-blue-200/50 dark:bg-blue-800/30 rounded-full">
                      <Fuel className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                  <div className="mt-2 flex items-center text-sm">
                    <span className="text-blue-600 dark:text-blue-400">
                      {stats.totalVolume.toFixed(1)}L total
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/50 dark:to-orange-900/50 backdrop-blur-sm border-orange-200/50 dark:border-orange-700/50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-orange-700 dark:text-orange-300">
                        Cost per KM
                      </p>
                      <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                        ৳
                        {stats.costPerKm > 0
                          ? stats.costPerKm.toFixed(2)
                          : "N/A"}
                      </p>
                    </div>
                    <div className="p-3 bg-orange-200/50 dark:bg-orange-800/30 rounded-full">
                      <BarChart3 className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                    </div>
                  </div>
                  <div className="mt-2 flex items-center text-sm">
                    <span className="text-orange-600 dark:text-orange-400">
                      {stats.totalDistance.toLocaleString()} KM
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Charts */}
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-slate-200/50 dark:border-slate-700/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Fuel Efficiency Trend
                </CardTitle>
                <CardDescription>Mileage (km/L) over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData.filter((d) => d.mileage > 0)}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        className="opacity-30"
                      />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip
                        formatter={(value: number) => [
                          `${value.toFixed(1)} km/L`,
                          "Mileage",
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
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-slate-200/50 dark:border-slate-700/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Spending by Vehicle
                </CardTitle>
                <CardDescription>Total fuel costs breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
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
                        formatter={(value: number) => [
                          `৳${value.toLocaleString()}`,
                          "Amount",
                        ]}
                      />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
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

          {/* Fuel Logs Table */}
          <Card className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-slate-200/50 dark:border-slate-700/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Fuel className="h-5 w-5" />
                All Fuel Entries
              </CardTitle>
              <CardDescription>
                Complete history of your fuel fill-ups and efficiency data
              </CardDescription>
            </CardHeader>
            <CardContent>
              {fuelLogs.length === 0 ? (
                <div className="text-center py-12">
                  <Fuel className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    No fuel entries found
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Add your first fuel entry to start tracking mileage
                  </p>
                  <Button onClick={addModal.openModal}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Fuel Entry
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {fuelLogs
                    .filter(
                      (log) =>
                        selectedVehicle === "all" ||
                        log.vehicle_id === selectedVehicle
                    )
                    .sort(
                      (a, b) =>
                        new Date(b.date).getTime() - new Date(a.date).getTime()
                    )
                    .map((log) => {
                      const vehicle = vehicles.find(
                        (v) => v.id === log.vehicle_id
                      );
                      const isMotorcycle = vehicle?.type === "motorcycle";

                      // Calculate mileage for this entry
                      const previousLog = fuelLogs
                        .filter(
                          (l) =>
                            l.vehicle_id === log.vehicle_id &&
                            new Date(l.date) < new Date(log.date)
                        )
                        .sort(
                          (a, b) =>
                            new Date(b.date).getTime() -
                            new Date(a.date).getTime()
                        )[0];

                      let mileage = 0;
                      let distanceTraveled = 0;

                      if (previousLog) {
                        distanceTraveled = log.odometer - previousLog.odometer;
                        if (distanceTraveled > 0 && log.volume > 0) {
                          mileage = distanceTraveled / log.volume;
                        }
                      }

                      return (
                        <div
                          key={log.id}
                          className="p-4 rounded-xl bg-white/40 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-700/50 hover:bg-white/60 dark:hover:bg-slate-800/60 transition-all duration-200 group"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex-1 space-y-3">
                              <div className="flex items-center gap-3">
                                <div
                                  className={`p-2 rounded-lg ${
                                    isMotorcycle
                                      ? "bg-orange-100 dark:bg-orange-900/30"
                                      : "bg-blue-100 dark:bg-blue-900/30"
                                  }`}
                                >
                                  <Fuel
                                    className={`h-4 w-4 ${
                                      isMotorcycle
                                        ? "text-orange-600 dark:text-orange-400"
                                        : "text-blue-600 dark:text-blue-400"
                                    }`}
                                  />
                                </div>
                                <div>
                                  <h4 className="font-semibold text-slate-900 dark:text-slate-100">
                                    {vehicle?.name || "Unknown Vehicle"}
                                  </h4>
                                  <p className="text-sm text-slate-600 dark:text-slate-400">
                                    {new Date(log.date).toLocaleDateString(
                                      "en-IN",
                                      {
                                        weekday: "short",
                                        year: "numeric",
                                        month: "short",
                                        day: "numeric",
                                      }
                                    )}
                                  </p>
                                </div>
                              </div>

                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                                <div>
                                  <p className="text-muted-foreground">
                                    Odometer
                                  </p>
                                  <p className="font-medium">
                                    {log.odometer.toLocaleString()} KM
                                  </p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground">
                                    Volume
                                  </p>
                                  <p className="font-medium">
                                    {log.volume.toFixed(1)} L
                                  </p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground">
                                    Price/L
                                  </p>
                                  <p className="font-medium">
                                    ৳{log.unit_price.toFixed(2)}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground">
                                    Total Cost
                                  </p>
                                  <p className="font-medium text-red-600 dark:text-red-400">
                                    ৳{log.total_cost.toLocaleString()}
                                  </p>
                                </div>
                              </div>

                              {mileage > 0 && (
                                <div className="flex items-center gap-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                  <Gauge className="h-4 w-4 text-green-600 dark:text-green-400" />
                                  <div className="flex-1">
                                    <p className="text-sm font-medium text-green-800 dark:text-green-300">
                                      {mileage.toFixed(1)} km/L
                                    </p>
                                    <p className="text-xs text-green-600 dark:text-green-400">
                                      {distanceTraveled} KM traveled
                                    </p>
                                  </div>
                                  <div
                                    className={`px-2 py-1 rounded text-xs font-medium ${
                                      mileage > 20
                                        ? "bg-green-200 text-green-800 dark:bg-green-800/30 dark:text-green-300"
                                        : mileage > 15
                                          ? "bg-yellow-200 text-yellow-800 dark:bg-yellow-800/30 dark:text-yellow-300"
                                          : "bg-red-200 text-red-800 dark:bg-red-800/30 dark:text-red-300"
                                    }`}
                                  >
                                    {mileage > 20
                                      ? "Excellent"
                                      : mileage > 15
                                        ? "Good"
                                        : "Poor"}
                                  </div>
                                </div>
                              )}

                              {log.station && (
                                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                  <MapPin className="h-3 w-3" />
                                  <span>{log.station}</span>
                                </div>
                              )}

                              {log.notes && (
                                <p className="text-sm text-slate-600 dark:text-slate-400 italic">
                                  "{log.notes}"
                                </p>
                              )}
                            </div>

                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEdit(log)}
                                className="h-8 w-8 p-0 hover:bg-blue-100 dark:hover:bg-blue-900/30"
                              >
                                <Edit className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(log)}
                                className="h-8 w-8 p-0 hover:bg-red-100 dark:hover:bg-red-900/30"
                              >
                                <Trash2 className="h-4 w-4 text-red-600 dark:text-red-400" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      );
                    })}

                  {/* Summary Footer */}
                  <div className="mt-6 p-4 bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-700 rounded-lg">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wide">
                          Total Entries
                        </p>
                        <p className="text-lg font-bold text-slate-900 dark:text-slate-100">
                          {fuelLogs.length}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wide">
                          Total Volume
                        </p>
                        <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                          {stats?.totalVolume.toFixed(1) || 0}L
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wide">
                          Total Distance
                        </p>
                        <p className="text-lg font-bold text-green-600 dark:text-green-400">
                          {stats?.totalDistance.toLocaleString() || 0} KM
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wide">
                          Total Cost
                        </p>
                        <p className="text-lg font-bold text-red-600 dark:text-red-400">
                          ৳{stats?.totalCost.toLocaleString() || 0}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions Card */}
          <Card className="bg-gradient-to-br from-teal-50 to-blue-50 dark:from-teal-950/30 dark:to-blue-950/30 border-teal-200/50 dark:border-teal-700/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-teal-700 dark:text-teal-300">
                <Gauge className="h-5 w-5" />
                Fuel Efficiency Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div className="p-4 bg-white/60 dark:bg-slate-800/60 rounded-lg">
                  <h4 className="font-semibold mb-2 text-green-600 dark:text-green-400">
                    Best Performers (20+ km/L)
                  </h4>
                  <p className="text-muted-foreground">
                    {chartData.filter((entry) => entry.mileage >= 20).length}{" "}
                    entries with excellent mileage
                  </p>
                </div>
                <div className="p-4 bg-white/60 dark:bg-slate-800/60 rounded-lg">
                  <h4 className="font-semibold mb-2 text-yellow-600 dark:text-yellow-400">
                    Average Range (15-20 km/L)
                  </h4>
                  <p className="text-muted-foreground">
                    {
                      chartData.filter(
                        (entry) => entry.mileage >= 15 && entry.mileage < 20
                      ).length
                    }{" "}
                    entries with good mileage
                  </p>
                </div>
                <div className="p-4 bg-white/60 dark:bg-slate-800/60 rounded-lg">
                  <h4 className="font-semibold mb-2 text-red-600 dark:text-red-400">
                    Needs Attention (&lt;15 km/L)
                  </h4>
                  <p className="text-muted-foreground">
                    {
                      chartData.filter(
                        (entry) => entry.mileage > 0 && entry.mileage < 15
                      ).length
                    }{" "}
                    entries need review
                  </p>
                </div>
              </div>

              {stats && (
                <div className="mt-4 p-4 bg-white/40 dark:bg-slate-700/40 rounded-lg">
                  <h4 className="font-semibold mb-2">Quick Stats Summary</h4>
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
                          ? (
                              stats.totalCost / stats.totalFillUps
                            ).toLocaleString()
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
                      <span className="text-muted-foreground">
                        Efficiency Range:
                      </span>
                      <p className="font-medium">
                        {stats.worstMileage > 0 && stats.bestMileage > 0
                          ? `${stats.worstMileage.toFixed(1)} - ${stats.bestMileage.toFixed(1)} km/L`
                          : "No data"}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Add Fuel Log Modal */}
      <FuelLogModalForm
        isOpen={addModal.isOpen}
        onClose={addModal.closeModal}
        vehicles={vehicles}
        onCreateSubmit={async (data) => {
          await createFuelLog(data);
          addModal.closeModal();
        }}
      />

      {/* Edit Fuel Log Modal */}
      <FuelLogModalForm
        isOpen={editModal.isOpen}
        onClose={() => {
          editModal.closeModal();
          setSelectedLog(null);
        }}
        vehicles={vehicles}
        initialData={
          selectedLog
            ? {
                vehicle_id: selectedLog.vehicle_id,
                date: selectedLog.date,
                odometer: selectedLog.odometer,
                volume: selectedLog.volume,
                unit_price: selectedLog.unit_price,
                total_cost: selectedLog.total_cost,
                station: selectedLog.station,
                notes: selectedLog.notes,
              }
            : undefined
        }
        isEditing={true}
        onUpdateSubmit={async (data, logId) => {
          const updateData = {
            id: logId,
            ...data,
          };

          await updateFuelLog(updateData);
          editModal.closeModal();
          setSelectedLog(null);
        }}
      />

      {/* Confirmation Dialog */}
      {confirmation.config && (
        <ConfirmationDialog
          isOpen={confirmation.isOpen}
          onClose={confirmation.close}
          onConfirm={confirmation.config.onConfirm}
          title={confirmation.config.title}
          description={confirmation.config.description}
          confirmText={confirmation.config.confirmText}
          cancelText={confirmation.config.cancelText}
          type={confirmation.config.type}
          destructive={confirmation.config.destructive}
          loading={confirmation.loading}
        />
      )}
    </div>
  );
}
