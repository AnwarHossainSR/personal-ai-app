import { Button } from "@/components/ui/button";
import { VehicleForm } from "@/modules/fuel-log/ui/vehicle-form";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewVehiclePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto max-w-7xl">
        <div className="space-y-8 p-4 sm:p-6">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 sm:p-8 text-white">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/10 p-2 h-auto -ml-2"
                  >
                    <Link href="/fuel-log/vehicles">
                      <ArrowLeft className="h-5 w-5" />
                    </Link>
                  </Button>
                  <div>
                    <h1 className="text-3xl sm:text-4xl font-bold">
                      Add Vehicle
                    </h1>
                    <p className="text-blue-100 text-base sm:text-lg mt-1">
                      Add a new vehicle to your fleet and start tracking
                    </p>
                  </div>
                </div>
              </div>

              {/* Mobile-friendly breadcrumb */}
              <div className="flex items-center gap-2 text-sm text-blue-200 sm:hidden">
                <Link
                  href="/fuel-log/vehicles"
                  className="hover:text-white transition-colors"
                >
                  Vehicles
                </Link>
                <span>/</span>
                <span className="text-white">Add New</span>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="flex justify-center">
            <div className="w-full max-w-4xl">
              <VehicleForm />
            </div>
          </div>

          {/* Help Section */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/30 dark:bg-slate-800/30 backdrop-blur-sm rounded-xl p-6 border border-slate-200/50 dark:border-slate-700/50">
              <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-3">
                Quick Tips
              </h3>
              <div className="grid gap-3 sm:grid-cols-2 text-sm text-slate-600 dark:text-slate-400">
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                  <span>
                    Give your vehicle a memorable name for easy identification
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                  <span>
                    Choose the correct fuel type to get accurate tracking
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                  <span>
                    All vehicle information can be edited later if needed
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                  <span>
                    You can add fuel logs and service records after creation
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
