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
import type { CreateFuelLogInput } from "@/modules/fuel-log/actions/fuel-log-actions";
import { IVehicle } from "@/modules/fuel-log/models/vehicle";
import {
  AlertTriangle,
  Calculator,
  Calendar,
  DollarSign,
  Fuel,
  Gauge,
  Info,
  MapPin,
  Save,
} from "lucide-react";
import type React from "react";
import { useEffect, useState, useTransition } from "react";

interface FuelLogModalFormProps {
  isOpen: boolean;
  onClose: () => void;
  vehicles: IVehicle[];
  initialData?: Partial<CreateFuelLogInput>;
  isEditing?: boolean;
  onCreateSubmit?: (data: CreateFuelLogInput) => Promise<void>;
  onUpdateSubmit?: (data: CreateFuelLogInput, logId: string) => Promise<void>;
  logId?: string; // For edit mode
}

export function FuelLogModalForm({
  isOpen,
  onClose,
  vehicles,
  initialData,
  isEditing = false,
  onCreateSubmit,
  onUpdateSubmit,
  logId,
}: FuelLogModalFormProps) {
  const [formData, setFormData] = useState<CreateFuelLogInput>({
    vehicle_id: "",
    date: new Date().toISOString().split("T")[0],
    odometer: 0,
    volume: 0,
    unit_price: 0,
    total_cost: 0,
    station: "",
    notes: "",
  });

  const [error, setError] = useState("");
  const [warning, setWarning] = useState("");
  const [isPending, startTransition] = useTransition();
  const [autoCalculate, setAutoCalculate] = useState(true);
  const [showStationInput, setShowStationInput] = useState(false);

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

  // Validate total cost and show warning if mismatch
  useEffect(() => {
    if (
      !autoCalculate &&
      formData.volume > 0 &&
      formData.unit_price > 0 &&
      formData.total_cost > 0
    ) {
      const calculatedTotal = formData.volume * formData.unit_price;
      const difference = Math.abs(formData.total_cost - calculatedTotal);
      const tolerance = 0.01;

      if (difference > tolerance) {
        setWarning(
          `Calculated total (৳${calculatedTotal.toFixed(2)}) differs from entered total (৳${formData.total_cost.toFixed(2)})`
        );
      } else {
        setWarning("");
      }
    } else {
      setWarning("");
    }
  }, [
    formData.volume,
    formData.unit_price,
    formData.total_cost,
    autoCalculate,
  ]);

  // Reset form when modal opens/closes or initialData changes
  useEffect(() => {
    if (isOpen) {
      setFormData({
        vehicle_id: initialData?.vehicle_id || "",
        date: initialData?.date
          ? new Date(initialData?.date).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
        odometer: initialData?.odometer || 0,
        volume: initialData?.volume || 0,
        unit_price: initialData?.unit_price || 0,
        total_cost: initialData?.total_cost || 0,
        station: initialData?.station || "",
        notes: initialData?.notes || "",
      });
      setError("");
      setWarning("");
      setAutoCalculate(true);
      setShowStationInput(false);
    }
  }, [isOpen, initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Client-side validation
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
    if (formData.total_cost <= 0) {
      setError("Please enter a valid total cost");
      return;
    }

    // Date validation
    const selectedDate = new Date(formData.date);
    const today = new Date();
    today.setHours(23, 59, 59, 999);

    if (selectedDate > today) {
      setError("Date cannot be in the future");
      return;
    }

    // Volume validation (reasonable limits)
    if (formData.volume > 200) {
      setError("Volume seems too high. Please verify the amount");
      return;
    }

    startTransition(async () => {
      try {
        if (isEditing && onUpdateSubmit && logId) {
          await onUpdateSubmit(formData, logId);
        } else if (!isEditing && onCreateSubmit) {
          await onCreateSubmit(formData);
        }
      } catch (error: any) {
        console.error("Submit error:", error);
        setError(error.message || "An unexpected error occurred");
      }
    });
  };

  const handleChange =
    (field: keyof CreateFuelLogInput) => (value: string | number) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    };

  const handleStationChange = (value: string) => {
    if (value === "other") {
      setShowStationInput(true);
      setFormData((prev) => ({ ...prev, station: "" }));
    } else if (value === "none") {
      setShowStationInput(false);
      setFormData((prev) => ({ ...prev, station: "" }));
    } else {
      setShowStationInput(false);
      setFormData((prev) => ({ ...prev, station: value }));
    }
  };

  const selectedVehicle = vehicles.find((v) => v.id === formData.vehicle_id);

  const popularStations = [
    "CSD (Dhaka Cantonment)",
    "Clean Fuel Filling Station Ltd. (Mohakhali)",
    "Trust Filling Station (Near Primister's Office)",
    "Khilkhet CNG & Petrol Pump",
    "Talukder Filling Station (Asadgate)",
    "SP Filling Station (Gabtoli)",
  ];

  // Calculate estimated mileage if there's enough data
  const estimatedMileagePerLiter = formData.volume > 0 ? 38 : 0; // Default assumption

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <Fuel className="h-5 w-5 text-teal-600" />
          {isEditing ? "Edit Fuel Entry" : "Add Fuel Entry"}
        </div>
      }
      description="Record your fuel fill-up details to track mileage and expenses"
      size="lg"
    >
      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Error Alert */}
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

          {/* Warning Alert */}
          {warning && (
            <Alert className="bg-yellow-50/50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
              <Info className="h-4 w-4 text-yellow-600" />
              <AlertDescription className="font-medium text-yellow-800 dark:text-yellow-300">
                {warning}
              </AlertDescription>
            </Alert>
          )}

          {/* Vehicle and Date Section */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-slate-700 pb-2 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Basic Information
            </h3>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label
                  htmlFor="vehicle_id"
                  className="text-sm font-semibold text-slate-700 dark:text-slate-300"
                >
                  Vehicle <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.vehicle_id}
                  onValueChange={handleChange("vehicle_id")}
                  disabled={isPending}
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
                          <div className="flex flex-col">
                            <span className="font-medium">{vehicle.name}</span>
                            <span className="text-xs text-muted-foreground">
                              {vehicle.year} {vehicle.make}{" "}
                              {vehicle.vehicleModel}
                            </span>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedVehicle && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <Fuel className="h-3 w-3" />
                    Fuel Type: {selectedVehicle.fuel_type}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="date"
                  className="text-sm font-semibold text-slate-700 dark:text-slate-300"
                >
                  Fill-up Date <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleChange("date")(e.target.value)}
                  className="h-11 bg-white/50 dark:bg-slate-800/50 border-slate-300 dark:border-slate-600"
                  max={new Date().toISOString().split("T")[0]}
                  disabled={isPending}
                  required
                />
              </div>
            </div>
          </div>

          {/* Vehicle Information Section */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-slate-700 pb-2 flex items-center gap-2">
              <Gauge className="h-4 w-4" />
              Vehicle Reading
            </h3>

            <div className="space-y-2">
              <Label
                htmlFor="odometer"
                className="text-sm font-semibold text-slate-700 dark:text-slate-300"
              >
                Odometer Reading (KM) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="odometer"
                type="number"
                value={formData.odometer || ""}
                onChange={(e) =>
                  handleChange("odometer")(Number(e.target.value))
                }
                placeholder="e.g., 45200"
                className="h-11 bg-white/50 dark:bg-slate-800/50 border-slate-300 dark:border-slate-600"
                min="0"
                step="1"
                disabled={isPending}
                required
              />
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Current mileage shown on your vehicle's dashboard
              </p>
            </div>
          </div>

          {/* Fuel Details Section */}
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
                  Volume (Liters) <span className="text-red-500">*</span>
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
                  min="0.1"
                  step="0.1"
                  max="200"
                  disabled={isPending}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="unit_price"
                  className="text-sm font-semibold text-slate-700 dark:text-slate-300"
                >
                  Price per Liter (৳) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="unit_price"
                  type="number"
                  value={formData.unit_price || ""}
                  onChange={(e) =>
                    handleChange("unit_price")(Number(e.target.value))
                  }
                  placeholder="e.g., 115.50"
                  className="h-11 bg-white/50 dark:bg-slate-800/50 border-slate-300 dark:border-slate-600"
                  min="0.01"
                  step="0.01"
                  disabled={isPending}
                  required
                />
              </div>
            </div>

            {/* Total Cost Section */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="total_cost"
                  className="text-sm font-semibold text-slate-700 dark:text-slate-300"
                >
                  Total Cost (৳) <span className="text-red-500">*</span>
                </Label>
                <div className="flex items-center gap-2">
                  <Calculator className="h-3 w-3 text-slate-500" />
                  <button
                    type="button"
                    onClick={() => setAutoCalculate(!autoCalculate)}
                    className={`text-xs px-3 py-1 rounded-full transition-colors ${
                      autoCalculate
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                    }`}
                  >
                    {autoCalculate ? "Auto Calculate" : "Manual Entry"}
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
                placeholder="e.g., 4680.00"
                className="h-11 bg-white/50 dark:bg-slate-800/50 border-slate-300 dark:border-slate-600"
                min="0.01"
                step="0.01"
                readOnly={autoCalculate}
                disabled={isPending}
                required
              />
              {autoCalculate &&
                formData.volume > 0 &&
                formData.unit_price > 0 && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <DollarSign className="h-3 w-3" />
                    Calculated: {formData.volume}L × ৳{formData.unit_price} = ৳
                    {(formData.volume * formData.unit_price).toFixed(2)}
                  </p>
                )}
            </div>
          </div>

          {/* Location and Notes Section */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-slate-700 pb-2 flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Additional Information
            </h3>

            {/* Station Selection */}
            <div className="space-y-2">
              <Label
                htmlFor="station"
                className="text-sm font-semibold text-slate-700 dark:text-slate-300"
              >
                Fuel Station (Optional)
              </Label>
              <Select
                value={formData.station || "none"}
                onValueChange={handleStationChange}
                disabled={isPending}
              >
                <SelectTrigger className="h-11 bg-white/50 dark:bg-slate-800/50 border-slate-300 dark:border-slate-600">
                  <SelectValue placeholder="Select station or leave blank" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No station selected</SelectItem>
                  {popularStations.map((station) => (
                    <SelectItem key={station} value={station}>
                      {station}
                    </SelectItem>
                  ))}
                  <SelectItem value="other">Other (enter manually)</SelectItem>
                </SelectContent>
              </Select>

              {showStationInput && (
                <Input
                  value={formData.station}
                  onChange={(e) => handleChange("station")(e.target.value)}
                  placeholder="Enter station name"
                  className="h-11 bg-white/50 dark:bg-slate-800/50 border-slate-300 dark:border-slate-600"
                  maxLength={100}
                  disabled={isPending}
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
                placeholder="e.g., Highway trip, Full tank, Mixed city driving, Engine service done..."
                className="bg-white/50 dark:bg-slate-800/50 border-slate-300 dark:border-slate-600"
                rows={3}
                maxLength={500}
                disabled={isPending}
              />
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {formData.notes?.length || 0}/500 characters
              </p>
            </div>
          </div>

          {/* Preview/Summary Section */}
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
                        Total Cost
                      </p>
                      <p className="text-slate-900 dark:text-slate-100">
                        ৳{formData.total_cost.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-teal-700 dark:text-teal-300 font-medium">
                        Cost/L
                      </p>
                      <p className="text-slate-900 dark:text-slate-100">
                        ৳{formData.unit_price.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {formData.volume > 0 && (
                    <div className="mt-3 pt-3 border-t border-teal-200 dark:border-teal-700">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-teal-600 dark:text-teal-400">
                          Estimated range: ~
                          {(formData.volume * estimatedMileagePerLiter).toFixed(
                            0
                          )}{" "}
                          KM
                        </span>
                        <span className="text-teal-600 dark:text-teal-400">
                          Cost per KM: ~৳
                          {(
                            formData.total_cost /
                            (formData.volume * estimatedMileagePerLiter)
                          ).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

          {/* Action Buttons */}
          <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isPending}
              className="flex-1 sm:flex-none bg-white/50 dark:bg-slate-800/50 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                isPending ||
                !formData.vehicle_id ||
                !formData.volume ||
                !formData.unit_price ||
                !formData.total_cost
              }
              className="flex-1 sm:flex-none bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white shadow-lg disabled:opacity-50"
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
