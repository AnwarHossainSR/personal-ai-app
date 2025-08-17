import { Vehicle, type IVehicle } from "../models/vehicle"
import { FuelLog } from "../models/fuel-log"
import { ServiceLog } from "../models/service-log"
import dbConnect from "@/lib/db/connection"

export class VehicleService {
  static async getAll(userId: string): Promise<IVehicle[]> {
    await dbConnect()
    return Vehicle.find({ user_id: userId }).sort({ created_at: -1 })
  }

  static async getById(id: string, userId: string): Promise<IVehicle | null> {
    await dbConnect()
    return Vehicle.findOne({ _id: id, user_id: userId })
  }

  static async create(data: Partial<IVehicle>, userId: string): Promise<IVehicle> {
    await dbConnect()
    const vehicle = new Vehicle({ ...data, user_id: userId })
    return vehicle.save()
  }

  static async update(id: string, userId: string, data: Partial<IVehicle>): Promise<IVehicle | null> {
    await dbConnect()
    return Vehicle.findOneAndUpdate({ _id: id, user_id: userId }, data, { new: true })
  }

  static async delete(id: string, userId: string): Promise<boolean> {
    await dbConnect()

    // Check if vehicle has associated logs
    const fuelLogs = await FuelLog.countDocuments({ vehicle_id: id, user_id: userId })
    const serviceLogs = await ServiceLog.countDocuments({ vehicle_id: id, user_id: userId })

    if (fuelLogs > 0 || serviceLogs > 0) {
      throw new Error("Cannot delete vehicle with existing fuel or service logs")
    }

    const result = await Vehicle.deleteOne({ _id: id, user_id: userId })
    return result.deletedCount > 0
  }

  static async getVehicleStats(vehicleId: string, userId: string) {
    await dbConnect()

    const [fuelStats, serviceStats] = await Promise.all([
      FuelLog.aggregate([
        { $match: { vehicle_id: vehicleId, user_id: userId } },
        {
          $group: {
            _id: null,
            totalFuelCost: { $sum: "$total_cost" },
            totalVolume: { $sum: "$volume" },
            avgUnitPrice: { $avg: "$unit_price" },
            entryCount: { $sum: 1 },
            lastFillUp: { $max: "$date" },
          },
        },
      ]),
      ServiceLog.aggregate([
        { $match: { vehicle_id: vehicleId, user_id: userId } },
        {
          $group: {
            _id: null,
            totalServiceCost: { $sum: "$cost" },
            serviceCount: { $sum: 1 },
            lastService: { $max: "$date" },
          },
        },
      ]),
    ])

    return {
      fuel: fuelStats[0] || {
        totalFuelCost: 0,
        totalVolume: 0,
        avgUnitPrice: 0,
        entryCount: 0,
        lastFillUp: null,
      },
      service: serviceStats[0] || {
        totalServiceCost: 0,
        serviceCount: 0,
        lastService: null,
      },
    }
  }
}
