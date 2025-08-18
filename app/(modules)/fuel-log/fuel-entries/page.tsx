"use client";

import {
  ConfirmationDialog,
  useConfirmation,
} from "@/components/confirmation-dialog";
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
import { useEffect, useState } from "react";

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

interface FuelLog {
  _id: string;
  vehicle_id: string;
  vehicle_name: string;
  date: string;
  odometer: number;
  volume: number;
  unit_price: number;
  total_cost: number;
  station?: string;
  notes?: string;
  mileage?: number;
  distance_traveled?: number;
}

interface Vehicle {
  _id: string;
  name: string;
  make: string;
  model: string;
  year: number;
  type: string;
  fuel_type: string;
}

interface FuelStats {
  totalCost: number;
  totalVolume: number;
  averagePrice: number;
  averageMileage: number;
  totalDistance: number;
  totalFillUps: number;
  bestMileage: number;
  worstMileage: number;
  costPerKm: number;
  monthlyAverage: number;
}

export default function FuelLogPage() {
  const [fuelLogs, setFuelLogs] = useState<FuelLog[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<FuelStats | null>(null);
  const [selectedLog, setSelectedLog] = useState<FuelLog | null>(null);
  const [dateRange, setDateRange] = useState("all");

  // Modal hooks
  const addModal = useModal();
  const editModal = useModal();
  const confirmation = useConfirmation();

  useEffect(() => {
    // Simulate API call for data with Indian context
    setTimeout(() => {
      const mockVehicles: Vehicle[] = [
        {
          _id: "1",
          name: "Honda City",
          make: "Honda",
          model: "City",
          year: 2022,
          type: "car",
          fuel_type: "petrol",
        },
        {
          _id: "2",
          name: "Royal Enfield Classic",
          make: "Royal Enfield",
          model: "Classic 350",
          year: 2021,
          type: "bike",
          fuel_type: "petrol",
        },
        {
          _id: "3",
          name: "Maruti Swift",
          make: "Maruti Suzuki",
          model: "Swift",
          year: 2020,
          type: "car",
          fuel_type: "petrol",
        },
      ];

      const mockFuelLogs: FuelLog[] = [
        {
          _id: "1",
          vehicle_id: "1",
          vehicle_name: "Honda City",
          date: "2024-02-15",
          odometer: 45200,
          volume: 35.5, // Liters
          unit_price: 102.5, // ₹ per liter
          total_cost: 3638.75,
          station: "Indian Oil Petrol Pump",
          notes: "Full tank - highway trip",
          mileage: 16.2,
          distance_traveled: 575, // KM
        },
        {
          _id: "2",
          vehicle_id: "2",
          vehicle_name: "Royal Enfield Classic",
          date: "2024-02-12",
          odometer: 15800,
          volume: 12.5, // Liters
          unit_price: 102.8,
          total_cost: 1285,
          station: "Bharat Petroleum",
          notes: "Regular fill-up",
          mileage: 28.8,
          distance_traveled: 360, // KM
        },
        {
          _id: "3",
          vehicle_id: "1",
          vehicle_name: "Honda City",
          date: "2024-02-28",
          odometer: 45775,
          volume: 38.2,
          unit_price: 103.2,
          total_cost: 3942.24,
          station: "HP Petrol Station",
          notes: "City driving mostly",
          mileage: 15.1,
          distance_traveled: 575,
        },
        {
          _id: "4",
          vehicle_id: "3",
          vehicle_name: "Maruti Swift",
          date: "2024-02-20",
          odometer: 28500,
          volume: 32.0,
          unit_price: 102.7,
          total_cost: 3286.4,
          station: "Shell Petrol Station",
          mileage: 18.7,
          distance_traveled: 598,
        },
        {
          _id: "5",
          vehicle_id: "2",
          vehicle_name: "Royal Enfield Classic",
          date: "2024-03-05",
          odometer: 16160,
          volume: 13.8,
          unit_price: 103.5,
          total_cost: 1428.3,
          station: "Reliance Petroleum",
          mileage: 26.1,
          distance_traveled: 360,
        },
      ];

      setVehicles(mockVehicles);
      setFuelLogs(mockFuelLogs);
      calculateStats(mockFuelLogs, selectedVehicle);
      setLoading(false);
    }, 1000);
  }, []);

  const calculateStats = (logs: FuelLog[], vehicleFilter: string) => {
    const filteredLogs =
      vehicleFilter === "all"
        ? logs
        : logs.filter((log) => log.vehicle_id === vehicleFilter);

    if (filteredLogs.length === 0) {
      setStats(null);
      return;
    }

    const totalCost = filteredLogs.reduce(
      (sum, log) => sum + log.total_cost,
      0
    );
    const totalVolume = filteredLogs.reduce((sum, log) => sum + log.volume, 0);
    const totalDistance = filteredLogs.reduce(
      (sum, log) => sum + (log.distance_traveled || 0),
      0
    );
    const mileageEntries = filteredLogs.filter(
      (log) => log.mileage && log.mileage > 0
    );

    const averagePrice = totalVolume > 0 ? totalCost / totalVolume : 0;
    const averageMileage =
      mileageEntries.length > 0
        ? mileageEntries.reduce((sum, log) => sum + (log.mileage || 0), 0) /
          mileageEntries.length
        : 0;

    const bestMileage =
      mileageEntries.length > 0
        ? Math.max(...mileageEntries.map((log) => log.mileage || 0))
        : 0;

    const worstMileage =
      mileageEntries.length > 0
        ? Math.min(...mileageEntries.map((log) => log.mileage || 0))
        : 0;

    const costPerKm = totalDistance > 0 ? totalCost / totalDistance : 0;
    const monthlyAverage =
      filteredLogs.length > 0
        ? totalCost / Math.max(1, filteredLogs.length)
        : 0;

    setStats({
      totalCost,
      totalVolume,
      averagePrice,
      averageMileage,
      totalDistance,
      totalFillUps: filteredLogs.length,
      bestMileage,
      worstMileage,
      costPerKm,
      monthlyAverage,
    });
  };

  const handleVehicleChange = (vehicleId: string) => {
    setSelectedVehicle(vehicleId);
    calculateStats(fuelLogs, vehicleId);
  };

  const handleDelete = (log: FuelLog) => {
    confirmation.confirm({
      title: "Delete Fuel Log",
      description: `Are you sure you want to delete this fuel log entry from ${new Date(log.date).toLocaleDateString()}? This action cannot be undone.`,
      confirmText: "Delete Entry",
      cancelText: "Cancel",
      type: "danger",
      destructive: true,
      onConfirm: async () => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const updatedLogs = fuelLogs.filter((l) => l._id !== log._id);
        setFuelLogs(updatedLogs);
        calculateStats(updatedLogs, selectedVehicle);
      },
    });
  };

  const handleEdit = (log: FuelLog) => {
    setSelectedLog(log);
    editModal.openModal();
  };

  // Prepare chart data
  const chartData = fuelLogs
    .filter(
      (log) => selectedVehicle === "all" || log.vehicle_id === selectedVehicle
    )
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map((log) => ({
      date: new Date(log.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      mileage: log.mileage || 0,
      cost: log.total_cost,
      price: log.unit_price,
    }));

  const vehicleDistribution = vehicles
    .map((vehicle) => {
      const vehicleLogs = fuelLogs.filter(
        (log) => log.vehicle_id === vehicle._id
      );
      const totalCost = vehicleLogs.reduce(
        (sum, log) => sum + log.total_cost,
        0
      );
      return {
        name: vehicle.name,
        value: totalCost,
        color:
          vehicle._id === "1"
            ? "#3b82f6"
            : vehicle._id === "2"
              ? "#10b981"
              : vehicle._id === "3"
                ? "#f59e0b"
                : "#ef4444",
      };
    })
    .filter((item) => item.value > 0);

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="container mx-auto max-w-7xl">
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading fuel logs...</p>
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
                  className="bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm h-12 px-6"
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
                      {vehicles.map((vehicle) => (
                        <SelectItem key={vehicle._id} value={vehicle._id}>
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
                  <Select value={dateRange} onValueChange={setDateRange}>
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
                        ₹{stats.totalCost.toLocaleString()}
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
                        {stats.averageMileage.toFixed(1)} km/L
                      </p>
                    </div>
                    <div className="p-3 bg-green-200/50 dark:bg-green-800/30 rounded-full">
                      <Gauge className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                  </div>
                  <div className="mt-2 flex items-center text-sm">
                    <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                    <span className="text-green-600 dark:text-green-400">
                      Best: {stats.bestMileage.toFixed(1)} km/L
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
                        ₹{stats.averagePrice.toFixed(2)}
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
                        ₹{stats.costPerKm.toFixed(2)}
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
                    <LineChart data={chartData}>
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
                          `₹${value.toLocaleString()}`,
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
                        ₹{item.value.toLocaleString()}
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
                    .map((log) => (
                      <div
                        key={log._id}
                        className="p-4 rounded-xl bg-white/40 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-700/50 hover:bg-white/60 dark:hover:bg-slate-800/60 transition-all duration-200 group"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="flex-1 space-y-3">
                            <div className="flex items-center gap-3">
                              <div
                                className={`p-2 rounded-lg ${
                                  log.vehicle_name
                                    .toLowerCase()
                                    .includes("bike") ||
                                  log.vehicle_name
                                    .toLowerCase()
                                    .includes("enfield")
                                    ? "bg-orange-100 dark:bg-orange-900/30"
                                    : "bg-blue-100 dark:bg-blue-900/30"
                                }`}
                              >
                                <Fuel
                                  className={`h-4 w-4 ${
                                    log.vehicle_name
                                      .toLowerCase()
                                      .includes("bike") ||
                                    log.vehicle_name
                                      .toLowerCase()
                                      .includes("enfield")
                                      ? "text-orange-600 dark:text-orange-400"
                                      : "text-blue-600 dark:text-blue-400"
                                  }`}
                                />
                              </div>
                              <div>
                                <h4 className="font-semibold text-slate-900 dark:text-slate-100">
                                  {log.vehicle_name}
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
                                <p className="text-muted-foreground">Volume</p>
                                <p className="font-medium">
                                  {log.volume.toFixed(1)} L
                                </p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Price/L</p>
                                <p className="font-medium">
                                  ₹{log.unit_price.toFixed(2)}
                                </p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">
                                  Total Cost
                                </p>
                                <p className="font-medium text-red-600 dark:text-red-400">
                                  ₹{log.total_cost.toLocaleString()}
                                </p>
                              </div>
                            </div>

                            {log.mileage && (
                              <div className="flex items-center gap-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                <Gauge className="h-4 w-4 text-green-600 dark:text-green-400" />
                                <div className="flex-1">
                                  <p className="text-sm font-medium text-green-800 dark:text-green-300">
                                    {log.mileage.toFixed(1)} km/L
                                  </p>
                                  {log.distance_traveled && (
                                    <p className="text-xs text-green-600 dark:text-green-400">
                                      {log.distance_traveled} KM traveled
                                    </p>
                                  )}
                                </div>
                                <div
                                  className={`px-2 py-1 rounded text-xs font-medium ${
                                    log.mileage > 20
                                      ? "bg-green-200 text-green-800 dark:bg-green-800/30 dark:text-green-300"
                                      : log.mileage > 15
                                        ? "bg-yellow-200 text-yellow-800 dark:bg-yellow-800/30 dark:text-yellow-300"
                                        : "bg-red-200 text-red-800 dark:bg-red-800/30 dark:text-red-300"
                                  }`}
                                >
                                  {log.mileage > 20
                                    ? "Excellent"
                                    : log.mileage > 15
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
                    ))}

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
                          {fuelLogs
                            .reduce((sum, log) => sum + log.volume, 0)
                            .toFixed(1)}
                          L
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wide">
                          Total Distance
                        </p>
                        <p className="text-lg font-bold text-green-600 dark:text-green-400">
                          {fuelLogs
                            .reduce(
                              (sum, log) => sum + (log.distance_traveled || 0),
                              0
                            )
                            .toLocaleString()}{" "}
                          KM
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wide">
                          Total Cost
                        </p>
                        <p className="text-lg font-bold text-red-600 dark:text-red-400">
                          ₹
                          {fuelLogs
                            .reduce((sum, log) => sum + log.total_cost, 0)
                            .toLocaleString()}
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
                    {
                      fuelLogs.filter((log) => log.mileage && log.mileage >= 20)
                        .length
                    }{" "}
                    entries with excellent mileage
                  </p>
                </div>
                <div className="p-4 bg-white/60 dark:bg-slate-800/60 rounded-lg">
                  <h4 className="font-semibold mb-2 text-yellow-600 dark:text-yellow-400">
                    Average Range (15-20 km/L)
                  </h4>
                  <p className="text-muted-foreground">
                    {
                      fuelLogs.filter(
                        (log) =>
                          log.mileage && log.mileage >= 15 && log.mileage < 20
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
                      fuelLogs.filter((log) => log.mileage && log.mileage < 15)
                        .length
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
                        ₹
                        {(
                          stats.totalCost /
                          Math.max(
                            1,
                            new Set(
                              fuelLogs.map((log) => log.date.substring(0, 7))
                            ).size
                          )
                        ).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">
                        Cost per Fill-up:
                      </span>
                      <p className="font-medium">
                        ₹
                        {(
                          stats.totalCost / stats.totalFillUps
                        ).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">
                        Avg Volume/Fill:
                      </span>
                      <p className="font-medium">
                        {(stats.totalVolume / stats.totalFillUps).toFixed(1)}L
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">
                        Efficiency Range:
                      </span>
                      <p className="font-medium">
                        {stats.worstMileage.toFixed(1)} -{" "}
                        {stats.bestMileage.toFixed(1)} km/L
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modals would go here - Add and Edit Fuel Log forms */}

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
