import { Fuel-logs, IFuel-logs } from '../models';
import dbConnect from '@/lib/db/connection';

export class Fuel-logsRepository {
  static async findByUserId(userId: string): Promise<IFuel-logs[]> {
    await dbConnect();
    return Fuel-logs.find({ user_id: userId }).sort({ created_at: -1 });
  }

  static async findById(id: string, userId: string): Promise<IFuel-logs | null> {
    await dbConnect();
    return Fuel-logs.findOne({ _id: id, user_id: userId });
  }

  static async create(data: Partial<IFuel-logs>): Promise<IFuel-logs> {
    await dbConnect();
    const item = new Fuel-logs(data);
    return item.save();
  }

  static async update(id: string, userId: string, data: Partial<IFuel-logs>): Promise<IFuel-logs | null> {
    await dbConnect();
    return Fuel-logs.findOneAndUpdate(
      { _id: id, user_id: userId },
      data,
      { new: true }
    );
  }

  static async delete(id: string, userId: string): Promise<boolean> {
    await dbConnect();
    const result = await Fuel-logs.deleteOne({ _id: id, user_id: userId });
    return result.deletedCount > 0;
  }
}
