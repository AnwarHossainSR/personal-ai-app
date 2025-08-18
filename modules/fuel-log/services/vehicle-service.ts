import dbConnect from "@/lib/db/connection";
import { FuelLog } from "../models/fuel-log";
import { ServiceLog } from "../models/service-log";
import { Vehicle, type IVehicle } from "../models/vehicle";

export class VehicleService {
  static async getAll(userId: string): Promise<IVehicle[]> {
    try {
      await dbConnect();
      return Vehicle.find({ user_id: userId }).sort({ created_at: -1 }).lean();
    } catch (error: any) {
      console.error(`Error fetching vehicles for user ${userId}:`, error);
      throw new Error(`Failed to fetch vehicles: ${error.message}`);
    }
  }

  static async getById(id: string, userId: string): Promise<IVehicle | null> {
    try {
      await dbConnect();
      return Vehicle.findOne({ _id: id, user_id: userId }).lean(); // Query uses _id
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
      return vehicle.save().then((doc) => doc.toObject());
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
      return Vehicle.findOneAndUpdate(
        { _id: id, user_id: userId }, // Query uses _id
        data,
        { new: true }
      ).lean();
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

      const result = await Vehicle.deleteOne({ _id: id, user_id: userId }); // Query uses _id
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
