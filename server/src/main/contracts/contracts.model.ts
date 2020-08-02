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
};

export const contractSchema = new mongoose.Schema(
  {
    customer: { type: Customer.schema, required: true },

    samplingLocation: { type: String, required: true },
    sampleReceivedDate: { type: Date, required: true },
    resultReturnDate: { type: Date, required: true },

    numberInMonth: { type: Number, required: true },

    date: {
      type: String,
      required: true,
      default: dayjs().format('YYYYMMDD'),
    },
  },
  { timestamps: true }
);

export const Contract =
  (mongoose.connection.models[name] as mongoose.Model<ContractDocument>) ||
  mongoose.model<ContractDocument>(name, contractSchema);
