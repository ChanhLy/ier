import mongoose from 'mongoose';
import { CustomerDocument } from '../customers/customers.model';
import { SampleDocument } from '../samples/samples.model';

const name = 'contracts';

export type ContractBase = {
  customer: Partial<CustomerDocument> | string;
  samples?: Partial<SampleDocument>[];

  sampleReceivedDate: Date;
  resultReturnDate: Date;
  date: string;
  note?: string;
  readBy: string[];
  location: string;
  paid?: boolean;
  returned?: boolean;

  updatedAt: Date;
  deletedAt: Date;
};

export type ContractDocument = mongoose.Document & ContractBase;

export const contractSchema = new mongoose.Schema<ContractDocument>(
  {
    customer: { type: String, ref: 'customers' },

    sampleReceivedDate: { type: Date, required: true },
    resultReturnDate: { type: Date, required: true },

    readBy: { type: [String], default: [] },
    note: String,
    deletedAt: Date,
    paid: Boolean,
    returned: Boolean,
    location: { type: String, default: '' },
  },
  { timestamps: true }
);

export const Contract =
  (mongoose.connection.models[name] as mongoose.Model<ContractDocument>) ||
  mongoose.model<ContractDocument>(name, contractSchema);
