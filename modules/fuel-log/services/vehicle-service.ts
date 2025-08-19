import dbConnect from "@/lib/db/connection";
import { FuelLog } from "../models/fuel-log";
import { ServiceLog } from "../models/service-log";
import { Vehicle, type IVehicle } from "../models/vehicle";

export class VehicleService {
  // Helper method to serialize MongoDB documents
  private static serializeVehicle(vehicle: any): IVehicle {
    return {
      id: vehicle._id?.toString() || vehicle.id?.toString(),
      user_id: vehicle.user_id,
      name: vehicle.name,
      type: vehicle.type,
      make: vehicle.make,
      vehicleModel: vehicle.vehicleModel,
      year: vehicle.year,
      fuel_type: vehicle.fuel_type,
      created_at: vehicle.created_at || vehicle.createdAt,
      updated_at: vehicle.updated_at || vehicle.updatedAt,
    };
  }

  static async getAll(userId: string, limit: number = 10): Promise<IVehicle[]> {
    try {
      await dbConnect();
      const vehicles = await Vehicle.find({ user_id: userId })
        .sort({ created_at: -1 })
        .limit(limit)
        .lean();
      return vehicles.map(this.serializeVehicle);
    } catch (error: any) {
      console.error(`Error fetching vehicles for user ${userId}:`, error);
      throw new Error(`Failed to fetch vehicles: ${error.message}`);
    }
  }

  static async getById(id: string, userId: string): Promise<IVehicle | null> {
    try {
      await dbConnect();
      const vehicle = await Vehicle.findOne({
        _id: id,
        user_id: userId,
      }).lean();

      return vehicle ? this.serializeVehicle(vehicle) : null;
    } catch (error: any) {
      console.error(`Error fetching vehicle ${id} for user ${userId}:`, error);
      throw new Error(`Failed to fetch vehicle: ${error.message}`);
    }
  }

  static async create(
    data: Partial<IVehicle>,
    userId: string
  ): Promise<IVehicle> {
    try {
      await dbConnect();
      const vehicle = new Vehicle({ ...data, user_id: userId });
      const saved = await vehicle.save();

      return this.serializeVehicle(saved.toObject());
    } catch (error: any) {
      console.error(`Error creating vehicle for user ${userId}:`, error);
      throw new Error(`Failed to create vehicle: ${error.message}`);
    }
  }

  static async update(
    id: string,
    userId: string,
    data: Partial<IVehicle>
  ): Promise<IVehicle | null> {
    try {
      await dbConnect();
      const vehicle = await Vehicle.findOneAndUpdate(
        { _id: id, user_id: userId },
        data,
        { new: true }
      ).lean();

      return vehicle ? this.serializeVehicle(vehicle) : null;
    } catch (error: any) {
      console.error(`Error updating vehicle ${id} for user ${userId}:`, error);
      throw new Error(`Failed to update vehicle: ${error.message}`);
    }
  }

  static async delete(id: string, userId: string): Promise<boolean> {
    try {
      await dbConnect();

      const fuelLogs = await FuelLog.countDocuments({
        vehicle_id: id,
        user_id: userId,
      });
      const serviceLogs = await ServiceLog.countDocuments({
        vehicle_id: id,
        user_id: userId,
      });

      if (fuelLogs > 0 || serviceLogs > 0) {
        throw new Error(
          "Cannot delete vehicle with existing fuel or service logs"
        );
      }

      const result = await Vehicle.deleteOne({ _id: id, user_id: userId });
      return result.deletedCount > 0;
    } catch (error: any) {
      console.error(`Error deleting vehicle ${id} for user ${userId}:`, error);
      throw new Error(`Failed to delete vehicle: ${error.message}`);
    }
  }

  static async getVehicleStats(vehicleId: string, userId: string) {
    try {
      await dbConnect();

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
      ]);

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
      };
    } catch (error: any) {
      console.error(`Error fetching stats for vehicle ${vehicleId}:`, error);
      throw new Error(`Failed to fetch vehicle stats: ${error.message}`);
    }
  }
}
