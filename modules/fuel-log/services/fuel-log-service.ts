import { FuelLog, type IFuelLog } from "../models/fuel-log"
import dbConnect from "@/lib/db/connection"

export class FuelLogService {
  static async getAll(
    userId: string,
    filters?: {
      vehicleId?: string
      startDate?: Date
      endDate?: Date
      station?: string
    },
  ): Promise<IFuelLog[]> {
    await dbConnect()

    const query: any = { user_id: userId }

    if (filters?.vehicleId) query.vehicle_id = filters.vehicleId
    if (filters?.startDate || filters?.endDate) {
      query.date = {}
      if (filters.startDate) query.date.$gte = filters.startDate
      if (filters.endDate) query.date.$lte = filters.endDate
    }
    if (filters?.station) {
      query.station = { $regex: filters.station, $options: "i" }
    }

    return FuelLog.find(query).sort({ date: -1 })
  }

  static async getById(id: string, userId: string): Promise<IFuelLog | null> {
    await dbConnect()
    return FuelLog.findOne({ _id: id, user_id: userId })
  }

  static async create(data: Partial<IFuelLog>, userId: string): Promise<IFuelLog> {
    await dbConnect()

    // Validate odometer progression
    if (data.vehicle_id && data.odometer) {
      const lastEntry = await FuelLog.findOne({
        vehicle_id: data.vehicle_id,
        user_id: userId,
      }).sort({ date: -1 })

      if (lastEntry && data.odometer < lastEntry.odometer) {
        throw new Error("Odometer reading cannot be less than the previous entry")
      }
    }

    const fuelLog = new FuelLog({ ...data, user_id: userId })
    return fuelLog.save()
  }

  static async update(id: string, userId: string, data: Partial<IFuelLog>): Promise<IFuelLog | null> {
    await dbConnect()
    return FuelLog.findOneAndUpdate({ _id: id, user_id: userId }, data, { new: true })
  }

  static async delete(id: string, userId: string): Promise<boolean> {
    await dbConnect()
    const result = await FuelLog.deleteOne({ _id: id, user_id: userId })
    return result.deletedCount > 0
  }

  static async getEfficiencyData(userId: string, vehicleId?: string) {
    await dbConnect()

    const matchStage: any = { user_id: userId }
    if (vehicleId) matchStage.vehicle_id = vehicleId

    const pipeline = [
      { $match: matchStage },
      { $sort: { vehicle_id: 1, date: 1 } },
      {
        $group: {
          _id: "$vehicle_id",
          entries: {
            $push: {
              date: "$date",
              odometer: "$odometer",
              volume: "$volume",
              total_cost: "$total_cost",
            },
          },
        },
      },
    ]

    const results = await FuelLog.aggregate(pipeline)

    return results.map((vehicle) => {
      const entries = vehicle.entries
      const efficiencyData = []

      for (let i = 1; i < entries.length; i++) {
        const current = entries[i]
        const previous = entries[i - 1]

        const distance = current.odometer - previous.odometer
        const efficiency = distance / current.volume // miles per gallon or km per liter

        efficiencyData.push({
          date: current.date,
          efficiency,
          cost: current.total_cost,
        })
      }

      return {
        vehicleId: vehicle._id,
        data: efficiencyData,
      }
    })
  }
}
