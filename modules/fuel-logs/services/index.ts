import { Fuel-logsRepository } from '../repositories';
import { IFuel-logs } from '../models';

export class Fuel-logsService {
  static async getAll(userId: string): Promise<IFuel-logs[]> {
    return Fuel-logsRepository.findByUserId(userId);
  }

  static async getById(id: string, userId: string): Promise<IFuel-logs | null> {
    return Fuel-logsRepository.findById(id, userId);
  }

  static async create(data: Partial<IFuel-logs>, userId: string): Promise<IFuel-logs> {
    return Fuel-logsRepository.create({ ...data, user_id: userId });
  }

  static async update(id: string, userId: string, data: Partial<IFuel-logs>): Promise<IFuel-logs | null> {
    return Fuel-logsRepository.update(id, userId, data);
  }

  static async delete(id: string, userId: string): Promise<boolean> {
    return Fuel-logsRepository.delete(id, userId);
  }
}
