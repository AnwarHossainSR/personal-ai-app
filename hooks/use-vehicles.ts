import { toast } from "@/components/ui/use-toast";
import { apiClient } from "@/lib/api/client";
import { IVehicle } from "@/modules/fuel-log/models/vehicle";
import { useCallback, useEffect, useState } from "react";

export function useVehicles() {
  const [vehicles, setVehicles] = useState<IVehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVehicles = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiClient.get<IVehicle[]>("/vehicles");
      setVehicles(response);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch vehicles";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  return {
    vehicles,
    loading,
    error,
    refetch: fetchVehicles,
  };
}
