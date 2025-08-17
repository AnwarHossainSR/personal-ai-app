"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import type React from "react";
import { useState, useTransition } from "react";
import { createVehicleAction } from "../actions/vehicle-actions";
import type { VehicleInput } from "../validators";

interface VehicleFormProps {
  initialData?: Partial<VehicleInput>;
  isEditing?: boolean;
}

export function VehicleForm({
  initialData,
  isEditing = false,
}: VehicleFormProps) {
  const [formData, setFormData] = useState<VehicleInput>({
    name: initialData?.name || "",
    type: initialData?.type || "car",
    make: initialData?.make || "",
    model: initialData?.model || "",
    year: initialData?.year || new Date().getFullYear(),
    fuel_type: initialData?.fuel_type || "gasoline",
  });
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    startTransition(async () => {
      try {
        const result = await createVehicleAction(formData);

        if (result.success) {
          router.push("/fuel-log/vehicles");
        } else {
          setError(result.error || "Failed to save vehicle");
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? "Edit Vehicle" : "Add New Vehicle"}</CardTitle>
        <CardDescription>
          {isEditing
            ? "Update vehicle information"
            : "Enter the details for your new vehicle"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Vehicle Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange("name")(e.target.value)}
                placeholder="e.g., My Honda Civic"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Vehicle Type</Label>
              <Select
                value={formData.type}
                onValueChange={handleChange("type")}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="car">Car</SelectItem>
                  <SelectItem value="truck">Truck</SelectItem>
                  <SelectItem value="motorcycle">Motorcycle</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="make">Make</Label>
              <Input
                id="make"
                value={formData.make}
                onChange={(e) => handleChange("make")(e.target.value)}
                placeholder="e.g., Honda"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="model">Model</Label>
              <Input
                id="model"
                value={formData.model}
                onChange={(e) => handleChange("model")(e.target.value)}
                placeholder="e.g., Civic"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="year">Year</Label>
              <Input
                id="year"
                type="number"
                value={formData.year}
                onChange={(e) =>
                  handleChange("year")(Number.parseInt(e.target.value))
                }
                min="1900"
                max={new Date().getFullYear() + 1}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fuel_type">Fuel Type</Label>
              <Select
                value={formData.fuel_type}
                onValueChange={handleChange("fuel_type")}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gasoline">Gasoline</SelectItem>
                  <SelectItem value="diesel">Diesel</SelectItem>
                  <SelectItem value="electric">Electric</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={isPending}>
              {isPending
                ? "Saving..."
                : isEditing
                  ? "Update Vehicle"
                  : "Add Vehicle"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
