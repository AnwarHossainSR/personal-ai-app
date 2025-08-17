import { AppLayout } from "@/components/layout/app-layout"
import { VehicleForm } from "@/modules/fuel-log/ui/vehicle-form"

export default function NewVehiclePage() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Add Vehicle</h1>
          <p className="text-muted-foreground">Add a new vehicle to your fleet.</p>
        </div>

        <div className="max-w-2xl">
          <VehicleForm />
        </div>
      </div>
    </AppLayout>
  )
}
