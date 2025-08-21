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
import { Modal, useModal } from "@/components/ui/modal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/use-toast";
import {
  AlertCircle,
  Calendar,
  Download,
  Edit,
  Filter,
  Plus,
  Search,
  Settings,
  Trash2,
  Wrench,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

// Mock interfaces - replace with your actual imports
interface IVehicle {
  id: string;
  name: string;
  make: string;
  vehicleModel: string;
  year: number;
  type: string;
  fuel_type: string;
}

interface ServiceLog {
  id: string;
  vehicle_id: string;
  date: string;
  odometer: number;
  service_type:
    | "oil_change"
    | "tire_rotation"
    | "brake_service"
    | "tune_up"
    | "repair"
    | "other";
  cost: number;
  notes?: string;
}

// Mock hooks - replace with your actual hooks
const useVehicles = () => {
  const [vehicles, setVehicles] = useState<IVehicle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setVehicles([
        {
          id: "1",
          name: "Honda Civic",
          make: "Honda",
          vehicleModel: "Civic",
          year: 2020,
          type: "car",
          fuel_type: "gasoline",
        },
        {
          id: "2",
          name: "Yamaha R15",
          make: "Yamaha",
          vehicleModel: "R15",
          year: 2021,
          type: "motorcycle",
          fuel_type: "gasoline",
        },
      ]);
      setLoading(false);
    }, 1500);
  }, []);

  return { vehicles, loading };
};

const useServiceLogs = () => {
  const [serviceLogs, setServiceLogs] = useState<ServiceLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setServiceLogs([
        {
          id: "1",
          vehicle_id: "1",
          date: "2024-01-15",
          odometer: 15000,
          service_type: "oil_change",
          cost: 3500,
          notes: "Full synthetic oil change with filter replacement",
        },
        {
          id: "2",
          vehicle_id: "1",
          date: "2024-02-20",
          odometer: 16000,
          service_type: "tire_rotation",
          cost: 1200,
          notes: "Tire rotation and pressure check",
        },
        {
          id: "3",
          vehicle_id: "2",
          date: "2024-03-10",
          odometer: 8000,
          service_type: "tune_up",
          cost: 2800,
          notes: "Annual tune-up and chain adjustment",
        },
      ]);
      setLoading(false);
    }, 2000);
  }, []);

  const createServiceLog = async (data: any) => {
    // Simulate API call
    const newLog: ServiceLog = {
      id: Date.now().toString(),
      ...data,
    };
    setServiceLogs((prev) => [newLog, ...prev]);
    toast({
      title: "Success",
      description: "Service entry created successfully.",
    });
  };

  const updateServiceLog = async (data: any) => {
    setServiceLogs((prev) =>
      prev.map((log) => (log.id === data.id ? { ...log, ...data } : log))
    );
    toast({
      title: "Success",
      description: "Service entry updated successfully.",
    });
  };

  const deleteServiceLog = async (id: string) => {
    setServiceLogs((prev) => prev.filter((log) => log.id !== id));
    toast({
      title: "Success",
      description: "Service entry deleted successfully.",
    });
  };

  const updateFilters = (filters: any) => {
    // Implement filtering logic
    console.log("Filters updated:", filters);
  };

  return {
    serviceLogs,
    loading,
    createServiceLog,
    updateServiceLog,
    deleteServiceLog,
    updateFilters,
  };
};

// Mock Service Form Component
const ServiceForm = ({
  initialData,
  isEditing,
  onSubmit,
  onCancel,
  vehicles,
}: {
  initialData?: any;
  isEditing: boolean;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  vehicles: IVehicle[];
}) => {
  const [formData, setFormData] = useState({
    vehicle_id: initialData?.vehicle_id || "",
    date: initialData?.date || new Date().toISOString().split("T")[0],
    odometer: initialData?.odometer || 0,
    service_type: initialData?.service_type || "oil_change",
    cost: initialData?.cost || 0,
    notes: initialData?.notes || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Vehicle</label>
          <Select
            value={formData.vehicle_id}
            onValueChange={(value) =>
              setFormData({ ...formData, vehicle_id: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select vehicle" />
            </SelectTrigger>
            <SelectContent>
              {vehicles.map((vehicle) => (
                <SelectItem key={vehicle.id} value={vehicle.id}>
                  {vehicle.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Date</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
              className="w-full p-2 border rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Odometer (KM)
            </label>
            <input
              type="number"
              value={formData.odometer}
              onChange={(e) =>
                setFormData({ ...formData, odometer: parseInt(e.target.value) })
              }
              className="w-full p-2 border rounded-md"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Service Type</label>
          <Select
            value={formData.service_type}
            onValueChange={(value) =>
              setFormData({ ...formData, service_type: value as any })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="oil_change">Oil Change</SelectItem>
              <SelectItem value="tire_rotation">Tire Rotation</SelectItem>
              <SelectItem value="brake_service">Brake Service</SelectItem>
              <SelectItem value="tune_up">Tune Up</SelectItem>
              <SelectItem value="repair">Repair</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Cost (৳)</label>
          <input
            type="number"
            step="0.01"
            value={formData.cost}
            onChange={(e) =>
              setFormData({ ...formData, cost: parseFloat(e.target.value) })
            }
            className="w-full p-2 border rounded-md"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Notes</label>
          <textarea
            value={formData.notes}
            onChange={(e) =>
              setFormData({ ...formData, notes: e.target.value })
            }
            className="w-full p-2 border rounded-md h-20"
            placeholder="Service details, parts replaced, etc."
          />
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="submit" className="flex-1">
          {isEditing ? "Update Service" : "Add Service"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default function ServiceEntriesPage() {
  const [selectedVehicle, setSelectedVehicle] = useState<string>("all");
  const [selectedLog, setSelectedLog] = useState<ServiceLog | null>(null);
  const [dateRange, setDateRange] = useState("all");
  const [serviceTypeFilter, setServiceTypeFilter] = useState("all");

  // Custom hooks for data management
  const { vehicles, loading: vehiclesLoading } = useVehicles();
  const {
    serviceLogs,
    loading: logsLoading,
    createServiceLog,
    updateServiceLog,
    deleteServiceLog,
    updateFilters,
  } = useServiceLogs();

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
      service_type: serviceTypeFilter === "all" ? undefined : serviceTypeFilter,
    });
  };

  const handleServiceTypeChange = (type: string) => {
    setServiceTypeFilter(type);
    updateFilters({
      vehicle_id: selectedVehicle === "all" ? undefined : selectedVehicle,
      service_type: type === "all" ? undefined : type,
    });
  };

  const handleDelete = (log: ServiceLog) => {
    const vehicle = vehicles.find((v) => v.id === log.vehicle_id);

    confirmation.confirm({
      title: "Delete Service Entry",
      description: `Are you sure you want to delete this service entry for ${vehicle?.name || "Unknown Vehicle"} from ${new Date(log.date).toLocaleDateString()}? This action cannot be undone.`,
      confirmText: "Delete Entry",
      cancelText: "Cancel",
      type: "danger",
      destructive: true,
      onConfirm: async () => {
        await deleteServiceLog(log.id);
      },
    });
  };

  const handleEdit = (log: ServiceLog) => {
    setSelectedLog(log);
    editModal.openModal();
  };

  const handleExportData = () => {
    if (serviceLogs.length === 0) {
      toast({
        title: "Error",
        description: "No data to export",
        variant: "destructive",
      });
      return;
    }

    try {
      const csvContent = [
        ["Date", "Vehicle", "Odometer", "Service Type", "Cost", "Notes"].join(
          ","
        ),
        ...serviceLogs.map((log) => {
          const vehicle = vehicles.find((v) => v.id === log.vehicle_id);
          return [
            log.date,
            `"${vehicle?.name || "Unknown"}"`,
            log.odometer,
            log.service_type.replace("_", " "),
            log.cost,
            `"${log.notes || ""}"`,
          ].join(",");
        }),
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `service-logs-${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Export error:", error);
      toast({
        title: "Error",
        description: "Failed to export data",
        variant: "destructive",
      });
    }
  };

  // Memoized calculations for better performance
  const { filteredLogs, serviceTypeDistribution, costSummary } = useMemo(() => {
    if (!serviceLogs || !Array.isArray(serviceLogs)) {
      return {
        filteredLogs: [],
        serviceTypeDistribution: [],
        costSummary: { total: 0, average: 0, count: 0 },
      };
    }

    const filtered = serviceLogs
      .filter(
        (log) => selectedVehicle === "all" || log.vehicle_id === selectedVehicle
      )
      .filter(
        (log) =>
          serviceTypeFilter === "all" || log.service_type === serviceTypeFilter
      );

    // Service type distribution
    const serviceTypeDist = filtered.reduce(
      (acc, log) => {
        const type = log.service_type.replace("_", " ").toUpperCase();
        if (!acc[type]) {
          acc[type] = { count: 0, totalCost: 0 };
        }
        acc[type].count++;
        acc[type].totalCost += log.cost;
        return acc;
      },
      {} as Record<string, { count: number; totalCost: number }>
    );

    const serviceTypeArray = Object.entries(serviceTypeDist).map(
      ([type, data]) => ({
        name: type,
        count: data.count,
        totalCost: data.totalCost,
        color: `hsl(${Math.abs(type.charCodeAt(0) * 123) % 360}, 70%, 50%)`,
      })
    );

    // Cost summary
    const totalCost = filtered.reduce((sum, log) => sum + log.cost, 0);
    const costSum = {
      total: totalCost,
      average: filtered.length > 0 ? totalCost / filtered.length : 0,
      count: filtered.length,
    };

    return {
      filteredLogs: filtered,
      serviceTypeDistribution: serviceTypeArray,
      costSummary: costSum,
    };
  }, [serviceLogs, selectedVehicle, serviceTypeFilter, vehicles]);

  // Service type icons and colors
  const serviceTypeConfig = {
    oil_change: {
      icon: "🛢️",
      color:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    },
    tire_rotation: {
      icon: "🔄",
      color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    },
    brake_service: {
      icon: "🛑",
      color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    },
    tune_up: {
      icon: "⚙️",
      color:
        "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    },
    repair: {
      icon: "🔧",
      color:
        "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
    },
    other: {
      icon: "🔩",
      color: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
    },
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="container mx-auto max-w-7xl">
          <div className="space-y-8 p-4 sm:p-6">
            {/* Header Skeleton */}
            <div className="bg-gradient-to-r from-cyan-900 to-cyan-950 rounded-2xl p-6 sm:p-8">
              <Skeleton className="h-10 w-64 mb-2 bg-white/20" />
              <Skeleton className="h-6 w-96 bg-white/10" />
            </div>

            {/* Filters Skeleton */}
            <div className="grid gap-4 lg:grid-cols-3">
              <div className="lg:col-span-2 flex flex-col sm:flex-row gap-4">
                <Card className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-slate-200/50 dark:border-slate-700/50">
                  <CardContent className="p-4">
                    <Skeleton className="h-8 w-48" />
                  </CardContent>
                </Card>
                <Card className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-slate-200/50 dark:border-slate-700/50">
                  <CardContent className="p-4">
                    <Skeleton className="h-8 w-48" />
                  </CardContent>
                </Card>
              </div>
              <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950/30 dark:to-indigo-950/30 border-blue-200/50 dark:border-blue-700/50">
                <CardContent className="p-4 text-center">
                  <Skeleton className="h-6 w-32 mx-auto mb-2" />
                  <Skeleton className="h-8 w-16 mx-auto mb-1" />
                  <Skeleton className="h-4 w-24 mx-auto" />
                </CardContent>
              </Card>
            </div>

            {/* Content Skeleton */}
            <Card className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-slate-200/50 dark:border-slate-700/50">
              <CardHeader>
                <Skeleton className="h-6 w-48 mb-2" />
                <Skeleton className="h-4 w-64" />
              </CardHeader>
              <CardContent className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="p-4 rounded-xl bg-white/40 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-700/50"
                  >
                    <div className="flex items-start gap-4">
                      <Skeleton className="h-10 w-10 rounded-lg" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-6 w-48" />
                        <Skeleton className="h-4 w-32" />
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                          {[1, 2, 3, 4].map((j) => (
                            <div key={j}>
                              <Skeleton className="h-3 w-16 mb-1" />
                              <Skeleton className="h-4 w-20" />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Debug info card for development
  const isDebugMode = process.env.NODE_ENV === "development";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto max-w-7xl">
        <div className="space-y-8 p-4 sm:p-6">
          {/* Debug Info (only in development) */}
          {isDebugMode && (
            <Card className="bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-yellow-700 dark:text-yellow-300">
                  <AlertCircle className="h-5 w-5" />
                  Debug Info
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Vehicles:</span>{" "}
                    {vehicles?.length || 0}
                  </div>
                  <div>
                    <span className="font-medium">Service Logs:</span>{" "}
                    {serviceLogs?.length || 0}
                  </div>
                  <div>
                    <span className="font-medium">Filtered:</span>{" "}
                    {filteredLogs.length}
                  </div>
                  <div>
                    <span className="font-medium">Loading:</span>{" "}
                    {loading ? "Yes" : "No"}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Header */}
          <div className="bg-gradient-to-r from-cyan-900 to-cyan-950 rounded-2xl p-8 text-blue-100">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold mb-2">
                  Service Entries
                </h1>
                <p className="text-white text-base sm:text-lg">
                  Track and manage all your vehicle maintenance records
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  variant="ghost"
                  onClick={handleExportData}
                  className="bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm h-12 px-6"
                  disabled={serviceLogs.length === 0}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Export Data
                </Button>
                <Button
                  onClick={addModal.openModal}
                  className="bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm h-12 px-6"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Service Entry
                </Button>
              </div>
            </div>
          </div>

          {/* Filters and Quick Summary */}
          <div className="grid gap-4 lg:grid-cols-3">
            {/* Filters */}
            <div className="lg:col-span-2 flex flex-col sm:flex-row gap-4">
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
                    <Wrench className="h-5 w-5 text-slate-500" />
                    <Select
                      value={serviceTypeFilter}
                      onValueChange={handleServiceTypeChange}
                    >
                      <SelectTrigger className="w-48 border-0 bg-transparent">
                        <SelectValue placeholder="Service type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Services</SelectItem>
                        <SelectItem value="oil_change">Oil Change</SelectItem>
                        <SelectItem value="tire_rotation">
                          Tire Rotation
                        </SelectItem>
                        <SelectItem value="brake_service">
                          Brake Service
                        </SelectItem>
                        <SelectItem value="tune_up">Tune Up</SelectItem>
                        <SelectItem value="repair">Repair</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
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

            {/* Quick Summary */}
            <Card className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-950/30 dark:to-emerald-950/30 border-green-200/50 dark:border-green-700/50">
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-sm text-green-600 dark:text-green-400 font-medium mb-1">
                    Filtered Results
                  </p>
                  <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                    {filteredLogs.length}
                  </p>
                  <p className="text-xs text-green-600 dark:text-green-400">
                    service entries
                  </p>
                  <p className="text-sm font-semibold text-green-700 dark:text-green-300 mt-2">
                    ৳{costSummary.total.toLocaleString()}
                  </p>
                  <p className="text-xs text-green-600 dark:text-green-400">
                    total spent
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Service Logs List - Main Focus */}
          <Card className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-slate-200/50 dark:border-slate-700/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Service Entries
                  </CardTitle>
                  <CardDescription>
                    {selectedVehicle !== "all" ||
                    dateRange !== "all" ||
                    serviceTypeFilter !== "all"
                      ? `Showing ${filteredLogs.length} entries with current filters`
                      : `All ${filteredLogs.length} service entries`}
                  </CardDescription>
                </div>
                {filteredLogs.length > 0 && (
                  <div className="text-sm text-muted-foreground">
                    <Search className="h-4 w-4 inline mr-1" />
                    Use filters to narrow down results
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {filteredLogs.length === 0 ? (
                <div className="text-center py-12">
                  <Settings className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    No service entries found
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    {selectedVehicle !== "all" ||
                    dateRange !== "all" ||
                    serviceTypeFilter !== "all"
                      ? "Try adjusting your filters to see more entries"
                      : "Add your first service entry to start tracking vehicle maintenance"}
                  </p>
                  <Button onClick={addModal.openModal}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Service Entry
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredLogs
                    .sort(
                      (a, b) =>
                        new Date(b.date).getTime() - new Date(a.date).getTime()
                    )
                    .map((log) => {
                      const vehicle = vehicles.find(
                        (v) => v.id === log.vehicle_id
                      );
                      const serviceConfig =
                        serviceTypeConfig[
                          log.service_type as keyof typeof serviceTypeConfig
                        ] || serviceTypeConfig.other;
                      const isMotorcycle = vehicle?.type === "motorcycle";

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
                                  <div className="text-lg">
                                    {serviceConfig.icon}
                                  </div>
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
                                <div
                                  className={`px-3 py-1 rounded-full text-xs font-medium ${serviceConfig.color}`}
                                >
                                  {log.service_type
                                    .replace("_", " ")
                                    .toUpperCase()}
                                </div>
                              </div>

                              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
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
                                    Service Cost
                                  </p>
                                  <p className="font-medium text-red-600 dark:text-red-400">
                                    ৳{log.cost.toLocaleString()}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground">
                                    Service Type
                                  </p>
                                  <p className="font-medium">
                                    {log.service_type.replace("_", " ")}
                                  </p>
                                </div>
                              </div>

                              {log.notes && (
                                <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg">
                                  <p className="text-sm text-slate-700 dark:text-slate-300">
                                    <span className="font-medium">Notes:</span>{" "}
                                    {log.notes}
                                  </p>
                                </div>
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
                          Entries
                        </p>
                        <p className="text-lg font-bold text-slate-900 dark:text-slate-100">
                          {filteredLogs.length}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wide">
                          Total Cost
                        </p>
                        <p className="text-lg font-bold text-red-600 dark:text-red-400">
                          ৳{costSummary.total.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wide">
                          Avg Cost/Entry
                        </p>
                        <p className="text-lg font-bold text-green-600 dark:text-green-400">
                          ৳{costSummary.average.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wide">
                          Last Service
                        </p>
                        <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                          {filteredLogs.length > 0
                            ? new Date(
                                Math.max(
                                  ...filteredLogs.map((l) =>
                                    new Date(l.date).getTime()
                                  )
                                )
                              ).toLocaleDateString("en-IN", {
                                month: "short",
                                day: "numeric",
                              })
                            : "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Service Analysis - Simplified */}
          {filteredLogs.length > 0 && (
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Service Type Distribution */}
              <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border-purple-200/50 dark:border-purple-700/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-purple-700 dark:text-purple-300">
                    <Wrench className="h-5 w-5" />
                    Service Distribution
                  </CardTitle>
                  <CardDescription>Breakdown by service type</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {serviceTypeDistribution.map((service) => (
                    <div
                      key={service.name}
                      className="flex items-center justify-between p-3 bg-white/60 dark:bg-slate-800/60 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: service.color }}
                        ></div>
                        <span className="font-medium">{service.name}</span>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-sm">
                          {service.count} entries
                        </p>
                        <p className="text-xs text-muted-foreground">
                          ৳{service.totalCost.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Maintenance Insights */}
              <Card className="bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-950/30 dark:to-cyan-950/30 border-teal-200/50 dark:border-teal-700/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-teal-700 dark:text-teal-300">
                    <Settings className="h-5 w-5" />
                    Maintenance Insights
                  </CardTitle>
                  <CardDescription>
                    Analysis of your maintenance patterns
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 text-sm">
                    <div className="p-4 bg-white/60 dark:bg-slate-800/60 rounded-lg">
                      <h4 className="font-semibold mb-2 text-green-600 dark:text-green-400">
                        Most Frequent Service
                      </h4>
                      <p className="text-muted-foreground">
                        {serviceTypeDistribution.length > 0
                          ? `${serviceTypeDistribution.sort((a, b) => b.count - a.count)[0].name} (${serviceTypeDistribution.sort((a, b) => b.count - a.count)[0].count} times)`
                          : "No data available"}
                      </p>
                    </div>
                    <div className="p-4 bg-white/60 dark:bg-slate-800/60 rounded-lg">
                      <h4 className="font-semibold mb-2 text-blue-600 dark:text-blue-400">
                        Highest Cost Category
                      </h4>
                      <p className="text-muted-foreground">
                        {serviceTypeDistribution.length > 0
                          ? `${serviceTypeDistribution.sort((a, b) => b.totalCost - a.totalCost)[0].name} (৳${serviceTypeDistribution.sort((a, b) => b.totalCost - a.totalCost)[0].totalCost.toLocaleString()})`
                          : "No data available"}
                      </p>
                    </div>
                    <div className="p-4 bg-white/60 dark:bg-slate-800/60 rounded-lg">
                      <h4 className="font-semibold mb-2 text-yellow-600 dark:text-yellow-400">
                        Service Frequency
                      </h4>
                      <p className="text-muted-foreground">
                        {filteredLogs.length > 0 && filteredLogs.length > 1
                          ? (() => {
                              const dates = filteredLogs
                                .map((log) => new Date(log.date))
                                .sort((a, b) => a.getTime() - b.getTime());
                              const totalDays =
                                (dates[dates.length - 1].getTime() -
                                  dates[0].getTime()) /
                                (1000 * 60 * 60 * 24);
                              const avgDaysBetweenServices =
                                totalDays / (filteredLogs.length - 1);
                              return `Every ${Math.round(avgDaysBetweenServices)} days on average`;
                            })()
                          : "Need more entries for analysis"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 p-4 bg-white/40 dark:bg-slate-700/40 rounded-lg">
                    <h4 className="font-semibold mb-2">
                      Current Filter Summary
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div>
                        <span className="text-muted-foreground">
                          Date Range:
                        </span>
                        <p className="font-medium">
                          {dateRange === "all"
                            ? "All Time"
                            : `Last ${dateRange} days`}
                        </p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">
                          Vehicle Filter:
                        </span>
                        <p className="font-medium">
                          {selectedVehicle === "all"
                            ? "All Vehicles"
                            : vehicles.find((v) => v.id === selectedVehicle)
                                ?.name || "Unknown"}
                        </p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">
                          Service Type:
                        </span>
                        <p className="font-medium">
                          {serviceTypeFilter === "all"
                            ? "All Types"
                            : serviceTypeFilter.replace("_", " ")}
                        </p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">
                          Avg Days Between:
                        </span>
                        <p className="font-medium">
                          {filteredLogs.length > 1
                            ? (() => {
                                const dates = filteredLogs
                                  .map((log) => new Date(log.date))
                                  .sort((a, b) => a.getTime() - b.getTime());
                                const totalDays =
                                  (dates[dates.length - 1].getTime() -
                                    dates[0].getTime()) /
                                  (1000 * 60 * 60 * 24);
                                return `${Math.round(totalDays / (filteredLogs.length - 1))} days`;
                              })()
                            : "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* Add Service Log Modal */}
      <Modal
        isOpen={addModal.isOpen}
        onClose={addModal.closeModal}
        title="Add Service Entry"
        description="Record a new service or maintenance activity for your vehicle"
        size="xl"
      >
        <div className="p-6">
          <ServiceForm
            vehicles={vehicles}
            isEditing={false}
            onSubmit={async (data) => {
              await createServiceLog(data);
              addModal.closeModal();
            }}
            onCancel={addModal.closeModal}
          />
        </div>
      </Modal>

      {/* Edit Service Log Modal */}
      <Modal
        isOpen={editModal.isOpen}
        onClose={() => {
          editModal.closeModal();
          setSelectedLog(null);
        }}
        title="Edit Service Entry"
        description="Update the service record details"
        size="xl"
      >
        <div className="p-6">
          <ServiceForm
            initialData={selectedLog}
            vehicles={vehicles}
            isEditing={true}
            onSubmit={async (data) => {
              if (selectedLog) {
                await updateServiceLog({ id: selectedLog.id, ...data });
                editModal.closeModal();
                setSelectedLog(null);
              }
            }}
            onCancel={() => {
              editModal.closeModal();
              setSelectedLog(null);
            }}
          />
        </div>
      </Modal>

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
