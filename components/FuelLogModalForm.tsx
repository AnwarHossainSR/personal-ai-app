"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Modal } from "@/components/ui/modal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { IVehicle } from "@/modules/fuel-log/models/vehicle";
import { AlertTriangle, Calculator, Fuel, Save } from "lucide-react";
import type React from "react";
import { useEffect, useState, useTransition } from "react";

interface FuelLogInput {
  vehicle_id: string;
  date: string;
  odometer: number;
  volume: number;
  unit_price: number;
  total_cost: number;
  station?: string;
  notes?: string;
}

interface FuelLogModalFormProps {
  isOpen: boolean;
  onClose: () => void;
  vehicles: IVehicle[];
  initialData?: Partial<FuelLogInput>;
  isEditing?: boolean;
  onSubmit?: (data: FuelLogInput) => Promise<void>;
}

export function FuelLogModalForm({
  isOpen,
  onClose,
  vehicles,
  initialData,
  isEditing = false,
  onSubmit,
}: FuelLogModalFormProps) {
  const [formData, setFormData] = useState<FuelLogInput>({
    vehicle_id: initialData?.vehicle_id || "",
    date: initialData?.date || new Date().toISOString().split("T")[0],
    odometer: initialData?.odometer || 0,
    volume: initialData?.volume || 0,
    unit_price: initialData?.unit_price || 0,
    total_cost: initialData?.total_cost || 0,
    station: initialData?.station || "",
    notes: initialData?.notes || "",
  });
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const [autoCalculate, setAutoCalculate] = useState(true);

  // Auto-calculate total cost when volume or unit price changes
  useEffect(() => {
    if (autoCalculate && formData.volume > 0 && formData.unit_price > 0) {
      const calculatedTotal = formData.volume * formData.unit_price;
      setFormData((prev) => ({
        ...prev,
        total_cost: Math.round(calculatedTotal * 100) / 100,
      }));
    }
  }, [formData.volume, formData.unit_price, autoCalculate]);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen && !isEditing) {
      setFormData({
        vehicle_id: "",
        date: new Date().toISOString().split("T")[0],
        odometer: 0,
        volume: 0,
        unit_price: 0,
        total_cost: 0,
        station: "",
        notes: "",
      });
      setError("");
    }
  }, [isOpen, isEditing]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!formData.vehicle_id) {
      setError("Please select a vehicle");
      return;
    }
    if (formData.odometer <= 0) {
      setError("Please enter a valid odometer reading");
      return;
    }
    if (formData.volume <= 0) {
      setError("Please enter a valid fuel volume");
      return;
    }
    if (formData.unit_price <= 0) {
      setError("Please enter a valid fuel price per liter");
      return;
    }

    startTransition(async () => {
      try {
        if (onSubmit) {
          await onSubmit(formData);
          onClose();
        } else {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 1000));
          console.log("Fuel log data:", formData);
          onClose();
        }
      } catch (error) {
        setError("An unexpected error occurred");
      }
    });
  };

  const handleChange =
    (field: keyof FuelLogInput) => (value: string | number) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    };

  const selectedVehicle = vehicles.find((v) => v.id === formData.vehicle_id);
  const estimatedMileage =
    formData.volume > 0 ? formData.odometer / formData.volume : 0;

  // Common Indian fuel stations
  const popularStations = [
    "Indian Oil Petrol Pump",
    "Bharat Petroleum",
    "Hindustan Petroleum (HP)",
    "Shell Petrol Station",
    "Reliance Petroleum",
    "Nayara Energy",
    "Essar Oil",
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? "Edit Fuel Entry" : "Add Fuel Entry"}
      description="Record your fuel fill-up details to track mileage and expenses"
      size="lg"
    >
      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert
              variant="destructive"
              className="bg-red-50/50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
            >
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="font-medium">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {/* Vehicle and Date */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label
                htmlFor="vehicle_id"
                className="text-sm font-semibold text-slate-700 dark:text-slate-300"
              >
                Vehicle
              </Label>
              <Select
                value={formData.vehicle_id}
                onValueChange={handleChange("vehicle_id")}
              >
                <SelectTrigger className="h-11 bg-white/50 dark:bg-slate-800/50 border-slate-300 dark:border-slate-600">
                  <SelectValue placeholder="Select a vehicle" />
                </SelectTrigger>
                <SelectContent>
                  {vehicles.map((vehicle: IVehicle) => (
                    <SelectItem key={vehicle.id} value={vehicle.id}>
                      <div className="flex items-center gap-2">
                        <span>
                          {vehicle.type === "motorcycle" ? "🏍️" : "🚗"}
                        </span>
                        <span>{vehicle.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="date"
                className="text-sm font-semibold text-slate-700 dark:text-slate-300"
              >
                Date
              </Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleChange("date")(e.target.value)}
                className="h-11 bg-white/50 dark:bg-slate-800/50 border-slate-300 dark:border-slate-600"
                required
              />
            </div>
          </div>

          {/* Odometer Reading */}
          <div className="space-y-2">
            <Label
              htmlFor="odometer"
              className="text-sm font-semibold text-slate-700 dark:text-slate-300"
            >
              Odometer Reading (KM)
            </Label>
            <Input
              id="odometer"
              type="number"
              value={formData.odometer || ""}
              onChange={(e) => handleChange("odometer")(Number(e.target.value))}
              placeholder="e.g., 45200"
              className="h-11 bg-white/50 dark:bg-slate-800/50 border-slate-300 dark:border-slate-600"
              min="0"
              step="1"
              required
            />
          </div>

          {/* Fuel Details */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-slate-700 pb-2 flex items-center gap-2">
              <Fuel className="h-4 w-4" />
              Fuel Details
            </h3>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label
                  htmlFor="volume"
                  className="text-sm font-semibold text-slate-700 dark:text-slate-300"
                >
                  Volume (Liters)
                </Label>
                <Input
                  id="volume"
                  type="number"
                  value={formData.volume || ""}
                  onChange={(e) =>
                    handleChange("volume")(Number(e.target.value))
                  }
                  placeholder="e.g., 40.5"
                  className="h-11 bg-white/50 dark:bg-slate-800/50 border-slate-300 dark:border-slate-600"
                  min="0"
                  step="0.1"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="unit_price"
                  className="text-sm font-semibold text-slate-700 dark:text-slate-300"
                >
                  Price per Liter (৳)
                </Label>
                <Input
                  id="unit_price"
                  type="number"
                  value={formData.unit_price || ""}
                  onChange={(e) =>
                    handleChange("unit_price")(Number(e.target.value))
                  }
                  placeholder="e.g., 102.50"
                  className="h-11 bg-white/50 dark:bg-slate-800/50 border-slate-300 dark:border-slate-600"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="total_cost"
                  className="text-sm font-semibold text-slate-700 dark:text-slate-300"
                >
                  Total Cost (৳)
                </Label>
                <div className="flex items-center gap-2">
                  <Calculator className="h-3 w-3 text-slate-500" />
                  <button
                    type="button"
                    onClick={() => setAutoCalculate(!autoCalculate)}
                    className={`text-xs px-2 py-1 rounded ${
                      autoCalculate
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                    }`}
                  >
                    {autoCalculate ? "Auto" : "Manual"}
                  </button>
                </div>
              </div>
              <Input
                id="total_cost"
                type="number"
                value={formData.total_cost || ""}
                onChange={(e) =>
                  handleChange("total_cost")(Number(e.target.value))
                }
                placeholder="e.g., 4100.00"
                className="h-11 bg-white/50 dark:bg-slate-800/50 border-slate-300 dark:border-slate-600"
                min="0"
                step="0.01"
                readOnly={autoCalculate}
                required
              />
              {autoCalculate && (
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Automatically calculated: {formData.volume} L × ৳
                  {formData.unit_price} = ৳
                  {(formData.volume * formData.unit_price).toFixed(2)}
                </p>
              )}
            </div>
          </div>

          {/* Station */}
          <div className="space-y-2">
            <Label
              htmlFor="station"
              className="text-sm font-semibold text-slate-700 dark:text-slate-300"
            >
              Fuel Station (Optional)
            </Label>
            <Select
              value={formData.station}
              onValueChange={handleChange("station")}
            >
              <SelectTrigger className="h-11 bg-white/50 dark:bg-slate-800/50 border-slate-300 dark:border-slate-600">
                <SelectValue placeholder="Select or type station name" />
              </SelectTrigger>
              <SelectContent>
                {popularStations.map((station) => (
                  <SelectItem key={station} value={station}>
                    {station}
                  </SelectItem>
                ))}
                <SelectItem value="other">Other...</SelectItem>
              </SelectContent>
            </Select>
            {formData.station === "other" && (
              <Input
                value={formData.station}
                onChange={(e) => handleChange("station")(e.target.value)}
                placeholder="Enter station name"
                className="h-11 bg-white/50 dark:bg-slate-800/50 border-slate-300 dark:border-slate-600"
              />
            )}
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label
              htmlFor="notes"
              className="text-sm font-semibold text-slate-700 dark:text-slate-300"
            >
              Notes (Optional)
            </Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleChange("notes")(e.target.value)}
              placeholder="e.g., Highway trip, Full tank, Mixed city driving..."
              className="bg-white/50 dark:bg-slate-800/50 border-slate-300 dark:border-slate-600"
              rows={3}
            />
          </div>

          {/* Preview/Summary */}
          {selectedVehicle &&
            formData.volume > 0 &&
            formData.total_cost > 0 && (
              <div className="space-y-2">
                <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">
                  Entry Summary
                </h3>
                <div className="p-4 rounded-xl bg-gradient-to-r from-teal-50 to-blue-50 dark:from-teal-900/20 dark:to-blue-900/20 border border-teal-200 dark:border-teal-700">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-teal-700 dark:text-teal-300 font-medium">
                        Vehicle
                      </p>
                      <p className="text-slate-900 dark:text-slate-100">
                        {selectedVehicle.name}
                      </p>
                    </div>
                    <div>
                      <p className="text-teal-700 dark:text-teal-300 font-medium">
                        Volume
                      </p>
                      <p className="text-slate-900 dark:text-slate-100">
                        {formData.volume}L
                      </p>
                    </div>
                    <div>
                      <p className="text-teal-700 dark:text-teal-300 font-medium">
                        Cost
                      </p>
                      <p className="text-slate-900 dark:text-slate-100">
                        ৳{formData.total_cost.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-teal-700 dark:text-teal-300 font-medium">
                        Price/L
                      </p>
                      <p className="text-slate-900 dark:text-slate-100">
                        ৳{formData.unit_price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

          {/* Action Buttons */}
          <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 sm:flex-none bg-white/50 dark:bg-slate-800/50 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="flex-1 sm:flex-none bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white shadow-lg"
            >
              <Save className="mr-2 h-4 w-4" />
              {isPending
                ? "Saving..."
                : isEditing
                  ? "Update Entry"
                  : "Add Entry"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
