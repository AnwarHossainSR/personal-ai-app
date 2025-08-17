"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Car, Edit, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setVehicles([
        {
          _id: "1",
          name: "My Honda Civic",
          make: "Honda",
          model: "Civic",
          year: 2020,
          type: "car",
          fuel_type: "gasoline",
        },
        {
          _id: "2",
          name: "Work Truck",
          make: "Ford",
          model: "F-150",
          year: 2019,
          type: "truck",
          fuel_type: "gasoline",
        },
        {
          _id: "3",
          name: "Weekend Bike",
          make: "Harley",
          model: "Sportster",
          year: 2021,
          type: "motorcycle",
          fuel_type: "gasoline",
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  // Show loading state while Clerk is initializing
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="container mx-auto max-w-7xl">
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto max-w-7xl">
        <div className="space-y-8 p-6">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold mb-2">Vehicle Fleet</h1>
                <p className="text-blue-100 text-lg">
                  Manage your vehicles and track their information
                </p>
              </div>
              <Button
                asChild
                className="bg-white text-blue-600 hover:bg-blue-50"
              >
                <Link href="/fuel-log/vehicles/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Vehicle
                </Link>
              </Button>
            </div>
          </div>

          {/* Vehicles Grid */}
          {vehicles.length === 0 ? (
            <Card className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
              <CardContent className="text-center py-16">
                <Car className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
                <h3 className="text-xl font-semibold mb-2">
                  No vehicles found
                </h3>
                <p className="text-muted-foreground mb-6">
                  Add your first vehicle to get started with fuel tracking
                </p>
                <Button asChild>
                  <Link href="/fuel-log/vehicles/new">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Vehicle
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {vehicles.map((vehicle: any) => (
                <Card
                  key={vehicle._id}
                  className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm hover:shadow-lg transition-all duration-200 group"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-3 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800">
                          <Car className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">
                            {vehicle.name}
                          </CardTitle>
                          <CardDescription className="capitalize">
                            {vehicle.type}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/fuel-log/vehicles/${vehicle._id}/edit`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">
                          Make & Model
                        </span>
                        <span className="text-sm font-medium">
                          {vehicle.make} {vehicle.model}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">
                          Year
                        </span>
                        <span className="text-sm font-medium">
                          {vehicle.year}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">
                          Fuel Type
                        </span>
                        <span className="text-sm font-medium capitalize">
                          {vehicle.fuel_type.replace("_", " ")}
                        </span>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 bg-transparent"
                        >
                          Add Fuel Log
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 bg-transparent"
                        >
                          Service Log
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
    </div>
  );
}
