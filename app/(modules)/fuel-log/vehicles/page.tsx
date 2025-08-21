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
import { toast } from "@/components/ui/use-toast";
import {
  createVehicleAction,
  deleteVehicleAction,
  updateVehicleAction,
} from "@/modules/fuel-log/actions/vehicle-actions";
import { IVehicle } from "@/modules/fuel-log/models/vehicle";
import { VehicleForm } from "@/modules/fuel-log/ui/vehicle-form";
import { Car, Edit, Fuel, Plus, Settings, Trash2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<IVehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVehicle, setSelectedVehicle] = useState<IVehicle | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Modal hooks
  const vehicleModal = useModal();
  const confirmation = useConfirmation();

  async function loadVehicles() {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/vehicles", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch vehicles");
      }

      const userVehicles = await response.json();
      setVehicles(userVehicles);
    } catch (err) {
      setError("Failed to load vehicles");
      console.error("Error loading vehicles:", err);
      toast({
        title: "Error",
        description: "Failed to load vehicles. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  // Load vehicles on component mount
  useEffect(() => {
    loadVehicles();
  }, []);

  const handleCreate = () => {
    setSelectedVehicle(null);
    setIsCreating(true);
    vehicleModal.openModal();
  };

  const handleEdit = (vehicle: IVehicle) => {
    setSelectedVehicle(vehicle);
    setIsCreating(false);
    vehicleModal.openModal();
  };

  const handleDelete = (vehicle: IVehicle) => {
    confirmation.confirm({
      title: "Delete Vehicle",
      description: `Are you sure you want to delete "${vehicle.name}"? This action cannot be undone and will remove all associated fuel logs and service records.`,
      confirmText: "Delete Vehicle",
      cancelText: "Cancel",
      type: "danger",
      destructive: true,
      onConfirm: async () => {
        try {
          const result = await deleteVehicleAction({
            id: vehicle.id!,
            name: vehicle.name,
          });

          if (result.success) {
            setVehicles((prev) => prev.filter((v) => v.id !== vehicle.id));
            toast({
              title: "Success",
              description: `Vehicle "${vehicle.name}" has been deleted.`,
            });
          } else {
            toast({
              title: "Error",
              description: result.error || "Failed to delete vehicle",
              variant: "destructive",
            });
          }
        } catch (error) {
          console.error("Error deleting vehicle:", error);
          toast({
            title: "Error",
            description:
              "An unexpected error occurred while deleting the vehicle.",
            variant: "destructive",
          });
        }
      },
    });
  };

  const handleFormSubmit = async (formData: any) => {
    try {
      if (isCreating) {
        // Create new vehicle
        const result = await createVehicleAction(formData);

        if (result.success) {
          // Reload vehicles to get the new vehicle with proper ID
          await loadVehicles();

          vehicleModal.closeModal();
          toast({
            title: "Success",
            description: `Vehicle "${formData.name}" has been created successfully.`,
          });
        } else {
          toast({
            title: "Error",
            description: result.error || "Failed to create vehicle",
            variant: "destructive",
          });
        }
      } else {
        // Update existing vehicle
        if (!selectedVehicle) return;

        const result = await updateVehicleAction({
          id: selectedVehicle.id!,
          ...formData,
        });

        if (result.success) {
          // Update vehicle in local state
          setVehicles((prev) =>
            prev.map((v) =>
              v.id === selectedVehicle.id ? { ...v, ...formData } : v
            )
          );

          vehicleModal.closeModal();
          setSelectedVehicle(null);

          toast({
            title: "Success",
            description: "Vehicle updated successfully.",
          });
        } else {
          toast({
            title: "Error",
            description: result.error || "Failed to update vehicle",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error("Error saving vehicle:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while saving the vehicle.",
        variant: "destructive",
      });
    }
  };

  const handleModalClose = () => {
    vehicleModal.closeModal();
    setSelectedVehicle(null);
    setIsCreating(false);
  };

  const vehicleTypeEmoji = {
    car: "🚗",
    truck: "🚛",
    motorcycle: "🏍️",
    other: "🚙",
  };

  const fuelTypeColors = {
    Octane:
      "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
    gasoline:
      "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
    diesel:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    electric:
      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    hybrid: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  };

  // Show loading state while initializing
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="container mx-auto max-w-7xl">
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading vehicles...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error && !loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="container mx-auto max-w-7xl">
          <div className="flex items-center justify-center min-h-screen">
            <Card className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-slate-200/50 dark:border-slate-700/50">
              <CardContent className="text-center py-16 px-8">
                <Car className="h-16 w-16 text-red-500 mx-auto mb-6" />
                <h3 className="text-xl font-semibold mb-2 text-red-600">
                  Failed to Load Vehicles
                </h3>
                <p className="text-muted-foreground mb-6">{error}</p>
                <Button onClick={() => loadVehicles()} variant="outline">
                  Try Again
                </Button>
              </CardContent>
            </Card>
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
          <div className="bg-gradient-to-r from-cyan-900 to-cyan-950 rounded-2xl p-8 text-blue-100">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold mb-2">
                  Vehicle Fleet
                </h1>
                <p className="text-blue-100 text-base sm:text-lg">
                  Manage your vehicles and track their information
                </p>
                <p className="text-blue-200 text-sm mt-1">
                  {vehicles.length} vehicle{vehicles.length !== 1 ? "s" : ""}{" "}
                  registered
                </p>
              </div>
              <Button
                onClick={handleCreate}
                className="bg-white/10 text-white hover:bg-white/20 h-12 px-6 self-start sm:self-center"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Vehicle
              </Button>
            </div>
          </div>

          {/* Vehicles Grid */}
          {vehicles.length === 0 ? (
            <Card className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-slate-200/50 dark:border-slate-700/50">
              <CardContent className="text-center py-16">
                <Car className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
                <h3 className="text-xl font-semibold mb-2">
                  No vehicles found
                </h3>
                <p className="text-muted-foreground mb-6">
                  Add your first vehicle to get started with fuel tracking
                </p>
                <Button onClick={handleCreate}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Vehicle
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {vehicles.map((vehicle) => (
                <Card
                  key={vehicle.id}
                  className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm hover:shadow-xl transition-all duration-300 border-slate-200/50 dark:border-slate-700/50 hover:bg-white/80 dark:hover:bg-slate-800/80 overflow-hidden"
                >
                  <CardHeader className="pb-3 relative">
                    {/* Vehicle Icon and Info */}
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-3 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/50 dark:to-blue-800/50 flex-shrink-0">
                        <div className="text-xl">
                          {vehicleTypeEmoji[
                            vehicle.type as keyof typeof vehicleTypeEmoji
                          ] || "🚙"}
                        </div>
                      </div>
                      <div className="min-w-0 flex-1 overflow-hidden ">
                        <CardTitle
                          className="text-lg truncate max-w-[calc(100%-2rem)] space-y-2"
                          title={vehicle.name}
                        >
                          {vehicle.name}
                        </CardTitle>
                        <CardDescription className="capitalize truncate">
                          {vehicle.type}
                        </CardDescription>
                      </div>
                    </div>

                    {/* Action Buttons Row */}
                    <div className="flex gap-2 absolute justify-end top-15 right-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(vehicle)}
                        className="h-8 px-3 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        <span className="text-xs">Edit</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(vehicle)}
                        className="h-8 px-3 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        <span className="text-xs">Delete</span>
                      </Button>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-2 mt-5">
                    {/* Vehicle Details */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">
                          Make & Model
                        </span>
                        <span
                          className="text-sm font-medium text-right truncate max-w-[90%]"
                          title={`${vehicle.make} ${vehicle.vehicleModel}`}
                        >
                          {vehicle.make} {vehicle.vehicleModel}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">
                          Year
                        </span>
                        <span className="text-sm font-medium">
                          {vehicle.year}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">
                          Fuel Type
                        </span>
                        <span
                          className={`text-xs font-medium px-2 py-1 rounded-full ${
                            fuelTypeColors[
                              vehicle.fuel_type as keyof typeof fuelTypeColors
                            ] || fuelTypeColors.gasoline
                          }`}
                        >
                          {vehicle.fuel_type.replace("_", " ").toUpperCase()}
                        </span>
                      </div>
                    </div>

                    {/* Navigation Buttons */}
                    <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                          className="bg-transparent hover:bg-blue-50 dark:hover:bg-blue-900/20 border-blue-200 dark:border-teal-700 text-teal-700 dark:text-teal-400"
                        >
                          <Link
                            href={`/fuel-log/vehicles/${vehicle.id}/fuel-logs`}
                          >
                            <Fuel className="mr-1 h-3 w-3" />
                            <span className="text-xs">Fuel Log</span>
                          </Link>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                          className="bg-transparent hover:bg-green-50 dark:hover:bg-green-900/20 border-green-200 dark:border-green-700 text-green-700 dark:text-green-400"
                        >
                          <Link
                            href={`/fuel-log/vehicles/${vehicle.id}/service-logs`}
                          >
                            <Settings className="mr-1 h-3 w-3" />
                            <span className="text-xs">Service</span>
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Vehicle Modal (Create/Edit) */}
      <Modal
        isOpen={vehicleModal.isOpen}
        onClose={handleModalClose}
        title={isCreating ? "Add New Vehicle" : "Edit Vehicle"}
        description={
          isCreating
            ? "Enter the details for your new vehicle to start tracking"
            : "Update your vehicle information"
        }
        size="xl"
      >
        <div className="p-6">
          <VehicleForm
            initialData={selectedVehicle || undefined}
            isEditing={!isCreating}
            onSubmit={handleFormSubmit}
            onCancel={handleModalClose}
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
