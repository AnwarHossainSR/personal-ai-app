import { AppLayout } from "@/components/layout/app-layout"
import { Button } from "@/components/ui/button"
import { DataGrid, type DataGridColumn } from "@/components/ui/data-grid"
import { getAuthUser } from "@/lib/auth/clerk-helpers"
import { VehicleService } from "@/modules/fuel-log/services/vehicle-service"
import type { IVehicle } from "@/modules/fuel-log/models/vehicle"
import { Plus, Edit, Trash2 } from "lucide-react"
import Link from "next/link"

export default async function VehiclesPage() {
  const user = await getAuthUser()
  if (!user) return null

  const vehicles = await VehicleService.getAll(user.userId)

  const columns: DataGridColumn<IVehicle>[] = [
    {
      key: "name",
      header: "Name",
      sortable: true,
      searchable: true,
    },
    {
      key: "make",
      header: "Make",
      sortable: true,
      searchable: true,
    },
    {
      key: "model",
      header: "Model",
      sortable: true,
      searchable: true,
    },
    {
      key: "year",
      header: "Year",
      sortable: true,
    },
    {
      key: "type",
      header: "Type",
      sortable: true,
      render: (value) => <span className="capitalize">{value}</span>,
    },
    {
      key: "fuel_type",
      header: "Fuel Type",
      sortable: true,
      render: (value) => <span className="capitalize">{value.replace("_", " ")}</span>,
    },
    {
      key: "_id",
      header: "Actions",
      render: (value, row) => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/fuel-log/vehicles/${value}/edit`}>
              <Edit className="h-4 w-4" />
            </Link>
          </Button>
          <Button variant="ghost" size="sm">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ]

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Vehicles</h1>
            <p className="text-muted-foreground">Manage your vehicle fleet and track their information.</p>
          </div>
          <Button asChild>
            <Link href="/fuel-log/vehicles/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Vehicle
            </Link>
          </Button>
        </div>

        <DataGrid
          data={vehicles}
          columns={columns}
          emptyMessage="No vehicles found. Add your first vehicle to get started."
        />
      </div>
    </AppLayout>
  )
}
