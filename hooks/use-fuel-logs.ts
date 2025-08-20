"use client";

import {
  createFuelLogAction,
  deleteFuelLogAction,
  getFuelLogsAction,
  getFuelLogStatsAction,
  updateFuelLogAction,
  type CreateFuelLogInput,
  type UpdateFuelLogInput,
} from "@/modules/fuel-log/actions/fuel-log-actions";
import type { IFuelLog } from "@/modules/fuel-log/models/fuel-log";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export interface FuelLog {
  id: string;
  user_id: string;
  vehicle_id: string;
  date: string;
  odometer: number;
  volume: number;
  unit_price: number;
  total_cost: number;
  station?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface FuelLogStats {
  totalCost: number;
  totalVolume: number;
  totalFillUps: number;
  totalDistance: number;
  averageMileage: number;
  averagePrice: number;
  costPerKm: number;
  monthlyAverage: number;
  bestMileage: number;
  worstMileage: number;
}

interface UseFuelLogsFilters {
  vehicle_id?: string;
  start_date?: string;
  end_date?: string;
  station?: string;
}

export function useFuelLogs() {
  const [fuelLogs, setFuelLogs] = useState<FuelLog[]>([]);
  const [stats, setStats] = useState<FuelLogStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<UseFuelLogsFilters>({});

  // Use ref to prevent race conditions
  const loadingRef = useRef(false);

  const convertIFuelLogToFuelLog = (log: IFuelLog): FuelLog => ({
    id: log.id,
    user_id: log.user_id,
    vehicle_id: log.vehicle_id,
    date:
      log.date instanceof Date
        ? log.date.toISOString().split("T")[0]
        : String(log.date),
    odometer: Number(log.odometer) || 0,
    volume: Number(log.volume) || 0,
    unit_price: Number(log.unit_price) || 0,
    total_cost: Number(log.total_cost) || 0,
    station: log.station || undefined,
    notes: log.notes || undefined,
    created_at:
      log.created_at instanceof Date
        ? log.created_at.toISOString()
        : String(log.created_at),
    updated_at:
      log.updated_at instanceof Date
        ? log.updated_at.toISOString()
        : String(log.updated_at),
  });

  const loadFuelLogs = useCallback(async () => {
    // Prevent multiple simultaneous calls
    if (loadingRef.current) return;

    loadingRef.current = true;
    setLoading(true);

    try {
      const result = await getFuelLogsAction({
        vehicleId: filters.vehicle_id,
        startDate: filters.start_date,
        endDate: filters.end_date,
        station: filters.station,
      });

      if (result.success && result.data) {
        // Ensure result.data is an array
        const dataArray = Array.isArray(result.data) ? result.data : [];

        if (dataArray.length === 0) {
          console.log("⚠️ No fuel logs found");
          setFuelLogs([]);
        } else {
          // Convert with error handling for each log
          const convertedLogs: FuelLog[] = dataArray
            .map((log: IFuelLog) => {
              try {
                return convertIFuelLogToFuelLog(log);
              } catch (error) {
                console.error("❌ Error converting fuel log:", log, error);
                return null;
              }
            })
            .filter((log): log is FuelLog => log !== null);
          setFuelLogs(convertedLogs);
        }
      } else {
        console.error("❌ Failed to load fuel logs:", result.error);
        toast.error(result.error || "Failed to load fuel logs");
        setFuelLogs([]);
      }
    } catch (error) {
      console.error("💥 Exception loading fuel logs:", error);
      toast.error("Failed to load fuel logs");
      setFuelLogs([]);
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  }, [filters]);

  const loadStats = useCallback(async () => {
    try {
      const result: any = await getFuelLogStatsAction({});

      if (result.success) {
        setStats(result.data);
      } else {
        console.error("Stats error:", result.error);
        setStats(null);
      }
    } catch (error) {
      console.error("Error loading stats:", error);
      setStats(null);
    }
  }, []);

  useEffect(() => {
    loadFuelLogs();
    loadStats();
  }, [loadFuelLogs, loadStats]);

  const createFuelLog = async (data: CreateFuelLogInput) => {
    try {
      const result = await createFuelLogAction(data);
      if (result.success) {
        toast.success("Fuel log created successfully");
        await Promise.all([loadFuelLogs(), loadStats()]);
        return result.data;
      } else {
        toast.error(result.error || "Failed to create fuel log");
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Error creating fuel log:", error);
      throw error;
    }
  };

  const updateFuelLog = async (data: UpdateFuelLogInput) => {
    try {
      const result = await updateFuelLogAction(data);
      if (result.success) {
        toast.success("Fuel log updated successfully");
        await Promise.all([loadFuelLogs(), loadStats()]);
        return result.data;
      } else {
        toast.error(result.error || "Failed to update fuel log");
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Error updating fuel log:", error);
      throw error;
    }
  };

  const deleteFuelLog = async (id: string) => {
    try {
      const result = await deleteFuelLogAction({ id });
      if (result.success) {
        toast.success("Fuel log deleted successfully");
        await Promise.all([loadFuelLogs(), loadStats()]);
      } else {
        toast.error(result.error || "Failed to delete fuel log");
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Error deleting fuel log:", error);
      throw error;
    }
  };

  const updateFilters = (newFilters: UseFuelLogsFilters) => {
    setFilters((prev) => {
      const updated = { ...prev, ...newFilters };
      return updated;
    });
  };

  const refreshData = async () => {
    await Promise.all([loadFuelLogs(), loadStats()]);
  };

  return {
    fuelLogs,
    stats,
    loading,
    filters,
    createFuelLog,
    updateFuelLog,
    deleteFuelLog,
    updateFilters,
    refreshData,
  };
}
