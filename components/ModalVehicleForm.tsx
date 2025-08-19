"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createVehicleAction } from "@/modules/fuel-log/actions/vehicle-actions";
import { VehicleInput } from "@/modules/fuel-log/validators";
import { AlertTriangle, Save } from "lucide-react";
import type React from "react";
import { useState, useTransition } from "react";

interface ModalVehicleFormProps {
  initialData?: Partial<VehicleInput>;
  isEditing?: boolean;
  onSubmit?: (data: VehicleInput) => Promise<void>;
  onCancel?: () => void;
}

export function ModalVehicleForm({
  initialData,
  isEditing = false,
  onSubmit,
  onCancel,
}: ModalVehicleFormProps) {
  const [formData, setFormData] = useState<VehicleInput>({
    name: initialData?.name || "",
    type: initialData?.type || "car",
    make: initialData?.make || "",
    vehicleModel: initialData?.vehicleModel || "",
    year: initialData?.year || new Date().getFullYear(),
    fuel_type: initialData?.fuel_type || "gasoline",
  });
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    startTransition(async () => {
      try {
        if (onSubmit) {
          await onSubmit(formData);
        } else {
          const result = await createVehicleAction(formData);
          if (!result.success) {
            setError(result.error || "Failed to save vehicle");
          }
        }
      } catch (error) {
        setError("An unexpected error occurred");
      }
    });
  };

  const handleChange =
    (field: keyof VehicleInput) => (value: string | number) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    };

  const vehicleTypeIcons = {
    car: "🚗",
    truck: "🚛",
    motorcycle: "🏍️",
    other: "🚙",
  };

  const fuelTypeColors = {
    gasoline:
      "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400",
    diesel:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
    electric:
      "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
    hybrid: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <Alert
            variant="destructive"
            className="bg-red-50/50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
          >
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="font-medium">{error}</AlertDescription>
          </Alert>
        )}

        {/* Vehicle Basic Info */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label
              htmlFor="name"
              className="text-sm font-semibold text-slate-700 dark:text-slate-300"
            >
              Vehicle Name
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange("name")(e.target.value)}
              placeholder="e.g., My Honda Civic"
              className="h-11 bg-white/50 dark:bg-slate-800/50 border-slate-300 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-400"
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label
                htmlFor="type"
                className="text-sm font-semibold text-slate-700 dark:text-slate-300"
              >
                Vehicle Type
              </Label>
              <Select
                value={formData.type}
                onValueChange={handleChange("type")}
              >
                <SelectTrigger className="h-11 bg-white/50 dark:bg-slate-800/50 border-slate-300 dark:border-slate-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="car">
                    <div className="flex items-center gap-2">
                      <span>🚗</span>
                      <span>Car</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="truck">
                    <div className="flex items-center gap-2">
                      <span>🚛</span>
                      <span>Truck</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="motorcycle">
                    <div className="flex items-center gap-2">
                      <span>🏍️</span>
                      <span>Motorcycle</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="other">
                    <div className="flex items-center gap-2">
                      <span>🚙</span>
                      <span>Other</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="fuel_type"
                className="text-sm font-semibold text-slate-700 dark:text-slate-300"
              >
                Fuel Type
              </Label>
              <Select
                value={formData.fuel_type}
                onValueChange={handleChange("fuel_type")}
              >
                <SelectTrigger className="h-11 bg-white/50 dark:bg-slate-800/50 border-slate-300 dark:border-slate-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gasoline">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                      <span>Gasoline</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="diesel">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <span>Diesel</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="electric">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <span>Electric</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="hybrid">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                      <span>Hybrid</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Vehicle Specifications */}
        <div className="space-y-4">
          <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-slate-700 pb-2">
            Vehicle Specifications
          </h3>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label
                htmlFor="make"
                className="text-sm font-semibold text-slate-700 dark:text-slate-300"
              >
                Make
              </Label>
              <Input
                id="make"
                value={formData.make}
                onChange={(e) => handleChange("make")(e.target.value)}
                placeholder="e.g., Honda"
                className="h-11 bg-white/50 dark:bg-slate-800/50 border-slate-300 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-400"
                required
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="model"
                className="text-sm font-semibold text-slate-700 dark:text-slate-300"
              >
                Model
              </Label>
              <Input
                id="model"
                value={formData.vehicleModel}
                onChange={(e) => handleChange("vehicleModel")(e.target.value)}
                placeholder="e.g., Civic"
                className="h-11 bg-white/50 dark:bg-slate-800/50 border-slate-300 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-400"
                required
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="year"
                className="text-sm font-semibold text-slate-700 dark:text-slate-300"
              >
                Year
              </Label>
              <Input
                id="year"
                type="number"
                value={formData.year}
                onChange={(e) =>
                  handleChange("year")(Number.parseInt(e.target.value))
                }
                min="1900"
                max={new Date().getFullYear() + 1}
                className="h-11 bg-white/50 dark:bg-slate-800/50 border-slate-300 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-400"
                required
              />
            </div>
          </div>
        </div>

        {/* Preview Card */}
        {(formData.name || formData.make || formData.vehicleModel) && (
          <div className="space-y-2">
            <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">
              Preview
            </h3>
            <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border border-blue-200 dark:border-blue-700">
              <div className="flex items-center gap-3">
                <div className="text-2xl">
                  {
                    vehicleTypeIcons[
                      formData.type as keyof typeof vehicleTypeIcons
                    ]
                  }
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-slate-900 dark:text-slate-100">
                    {formData.name || "Vehicle Name"}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    {formData.make && formData.vehicleModel
                      ? `${formData.make} ${formData.vehicleModel} ${formData.year ? `• ${formData.year}` : ""}`
                      : "Make Model • Year"}
                  </div>
                </div>
                <div
                  className={`px-3 py-1 rounded-full text-xs font-medium ${fuelTypeColors[formData.fuel_type as keyof typeof fuelTypeColors]}`}
                >
                  {formData.fuel_type.replace("_", " ").toUpperCase()}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="flex-1 sm:flex-none bg-white/50 dark:bg-slate-800/50 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700"
            >
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            disabled={isPending}
            className="flex-1 sm:flex-none bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg"
          >
            <Save className="mr-2 h-4 w-4" />
            {isPending
              ? "Saving..."
              : isEditing
                ? "Update Vehicle"
                : "Add Vehicle"}
          </Button>
        </div>
      </form>
    </div>
  );
}
