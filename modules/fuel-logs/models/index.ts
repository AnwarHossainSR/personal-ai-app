import { Schema } from 'mongoose';
import { createModel, BaseDocument } from '@/lib/db/modelFactory';

export interface IFuel-logs extends BaseDocument {
  user_id: string;
  name: string;
  description?: string;
}

const fuel-logsSchema = new Schema<IFuel-logs>({
  user_id: {
    type: String,
    required: true,
    index: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
});

export const Fuel-logs = createModel<IFuel-logs>('Fuel-logs', fuel-logsSchema);
