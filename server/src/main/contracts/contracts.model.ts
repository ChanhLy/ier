import dayjs from 'dayjs';
import mongoose from 'mongoose';
import { Customer, CustomerDocument } from '../customers/customers.model';

const name = 'contracts';

export type ContractDocument = mongoose.Document & {
  customer: Partial<CustomerDocument>;

  samplingLocation: string;
  sampleReceivedDate: Date;
  resultReturnDate: Date;

  numberInMonth: number;
  date: string;

  readBy: string[];

  updatedAt: Date;
};

export const contractSchema = new mongoose.Schema(
  {
    customer: { type: Customer.schema, required: true },

    samplingLocation: { type: String, required: true },
    sampleReceivedDate: { type: Date, required: true },
    resultReturnDate: { type: Date, required: true },

    numberInMonth: { type: Number, required: true, default: 1 },

    date: {
      type: String,
      required: true,
      default: dayjs().format('YYYYMMDD'),
    },

    readBy: [String],
  },
  { timestamps: true }
);

export const Contract =
  (mongoose.connection.models[name] as mongoose.Model<ContractDocument>) ||
  mongoose.model<ContractDocument>(name, contractSchema);
