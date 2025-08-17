import { ServiceLog, type IServiceLog } from "../models/service-log"
import dbConnect from "@/lib/db/connection"

export class ServiceLogService {
  static async getAll(
    userId: string,
    filters?: {
      vehicleId?: string
      startDate?: Date
      endDate?: Date
      serviceType?: string
    },
  ): Promise<IServiceLog[]> {
    await dbConnect()

    const query: any = { user_id: userId }

    if (filters?.vehicleId) query.vehicle_id = filters.vehicleId
    if (filters?.startDate || filters?.endDate) {
      query.date = {}
      if (filters.startDate) query.date.$gte = filters.startDate
      if (filters.endDate) query.date.$lte = filters.endDate
    }
    if (filters?.serviceType) query.service_type = filters.serviceType

    return ServiceLog.find(query).sort({ date: -1 })
  }

  static async getById(id: string, userId: string): Promise<IServiceLog | null> {
    await dbConnect()
    return ServiceLog.findOne({ _id: id, user_id: userId })
  }

  static async create(data: Partial<IServiceLog>, userId: string): Promise<IServiceLog> {
    await dbConnect()
    const serviceLog = new ServiceLog({ ...data, user_id: userId })
    return serviceLog.save()
  }

  static async update(id: string, userId: string, data: Partial<IServiceLog>): Promise<IServiceLog | null> {
    await dbConnect()
    return ServiceLog.findOneAndUpdate({ _id: id, user_id: userId }, data, { new: true })
  }

  static async delete(id: string, userId: string): Promise<boolean> {
    await dbConnect()
    const result = await ServiceLog.deleteOne({ _id: id, user_id: userId })
    return result.deletedCount > 0
  }

  static async getServiceSummary(userId: string, vehicleId?: string) {
    await dbConnect()

    const matchStage: any = { user_id: userId }
    if (vehicleId) matchStage.vehicle_id = vehicleId

    return ServiceLog.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: "$service_type",
          totalCost: { $sum: "$cost" },
          count: { $sum: 1 },
          avgCost: { $avg: "$cost" },
          lastService: { $max: "$date" },
        },
      },
      { $sort: { totalCost: -1 } },
    ])
  }
}
