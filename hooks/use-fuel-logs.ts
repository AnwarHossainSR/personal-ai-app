// hooks/use-fuel-logs.ts
import { toast } from "@/components/ui/use-toast";
import { apiClient } from "@/lib/api/client";
import { useCallback, useEffect, useState } from "react";

export interface FuelLog {
  _id: string;
  vehicle_id: string;
  user_id: string;
  date: string;
  odometer: number;
  volume: number;
  unit_price: number;
  total_cost: number;
  station?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FuelLogInput {
  vehicle_id: string;
  date: string;
  odometer: number;
  volume: number;
  unit_price: number;
  total_cost: number;
  station?: string;
  notes?: string;
}

export interface FuelLogFilters {
  vehicle_id?: string;
  start_date?: string;
  end_date?: string;
  station?: string;
}

export interface FuelStats {
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

export function useFuelLogs(initialFilters?: FuelLogFilters) {
  const [fuelLogs, setFuelLogs] = useState<FuelLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FuelLogFilters>(initialFilters || {});

  const fetchFuelLogs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const queryParams = new URLSearchParams();
      if (filters.vehicle_id)
        queryParams.append("vehicle_id", filters.vehicle_id);
      if (filters.start_date)
        queryParams.append("start_date", filters.start_date);
      if (filters.end_date) queryParams.append("end_date", filters.end_date);
      if (filters.station) queryParams.append("station", filters.station);

      const response = await apiClient.get<{ data: FuelLog[] }>(
        `/fuel-logs?${queryParams.toString()}`
      );

      setFuelLogs(response.data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch fuel logs";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchFuelLogs();
  }, [fetchFuelLogs]);

  const createFuelLog = useCallback(async (data: FuelLogInput) => {
    try {
      const response = await apiClient.post<{ data: FuelLog }>(
        "/fuel-logs",
        data
      );
      setFuelLogs((prev) => [response.data, ...prev]);
      toast({
        title: "Success",
        description: "Fuel log created successfully",
      });
      return response.data;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to create fuel log";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    }
  }, []);

  const updateFuelLog = useCallback(async (id: string, data: FuelLogInput) => {
    try {
      const response = await apiClient.put<{ data: FuelLog }>(
        `/fuel-logs/${id}`,
        data
      );
      setFuelLogs((prev) =>
        prev.map((log) => (log._id === id ? response.data : log))
      );
      toast({
        title: "Success",
        description: "Fuel log updated successfully",
      });
      return response.data;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update fuel log";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    }
  }, []);

  const deleteFuelLog = useCallback(async (id: string) => {
    try {
      await apiClient.delete(`/fuel-logs/${id}`);
      setFuelLogs((prev) => prev.filter((log) => log._id !== id));
      toast({
        title: "Success",
        description: "Fuel log deleted successfully",
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete fuel log";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    }
  }, []);

  const calculateStats = useCallback((logs: FuelLog[]): FuelStats => {
    if (logs.length === 0) {
      return {
        totalCost: 0,
        totalVolume: 0,
        averagePrice: 0,
        averageMileage: 0,
        totalDistance: 0,
        totalFillUps: 0,
        bestMileage: 0,
        worstMileage: 0,
        costPerKm: 0,
        monthlyAverage: 0,
      };
    }

    const totalCost = logs.reduce((sum, log) => sum + log.total_cost, 0);
    const totalVolume = logs.reduce((sum, log) => sum + log.volume, 0);

    // Calculate mileage for entries where we can determine distance
    const sortedLogs = [...logs].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    const mileageEntries: number[] = [];
    let totalDistance = 0;

    // Group by vehicle to calculate mileage properly
    const vehicleGroups = logs.reduce(
      (groups, log) => {
        if (!groups[log.vehicle_id]) groups[log.vehicle_id] = [];
        groups[log.vehicle_id].push(log);
        return groups;
      },
      {} as Record<string, FuelLog[]>
    );

    Object.values(vehicleGroups).forEach((vehicleLogs) => {
      const sortedVehicleLogs = vehicleLogs.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );

      for (let i = 1; i < sortedVehicleLogs.length; i++) {
        const current = sortedVehicleLogs[i];
        const previous = sortedVehicleLogs[i - 1];
        const distance = current.odometer - previous.odometer;

        if (distance > 0 && current.volume > 0) {
          const mileage = distance / current.volume;
          mileageEntries.push(mileage);
          totalDistance += distance;
        }
      }
    });

    const averagePrice = totalVolume > 0 ? totalCost / totalVolume : 0;
    const averageMileage =
      mileageEntries.length > 0
        ? mileageEntries.reduce((sum, m) => sum + m, 0) / mileageEntries.length
        : 0;
    const bestMileage =
      mileageEntries.length > 0 ? Math.max(...mileageEntries) : 0;
    const worstMileage =
      mileageEntries.length > 0 ? Math.min(...mileageEntries) : 0;
    const costPerKm = totalDistance > 0 ? totalCost / totalDistance : 0;

    // Calculate monthly average
    const months = new Set(logs.map((log) => log.date.substring(0, 7))).size;
    const monthlyAverage = months > 0 ? totalCost / months : 0;

    return {
      totalCost,
      totalVolume,
      averagePrice,
      averageMileage,
      totalDistance,
      totalFillUps: logs.length,
      bestMileage,
      worstMileage,
      costPerKm,
      monthlyAverage,
    };
  }, []);

  const updateFilters = useCallback((newFilters: FuelLogFilters) => {
    setFilters(newFilters);
  }, []);

  const stats = calculateStats(fuelLogs);

  return {
    fuelLogs,
    loading,
    error,
    filters,
    stats,
    createFuelLog,
    updateFuelLog,
    deleteFuelLog,
    updateFilters,
    refetch: fetchFuelLogs,
  };
}
