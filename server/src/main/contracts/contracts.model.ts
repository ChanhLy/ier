import mongoose from 'mongoose';
import { socket } from '../..';
import { customerDefinition, CustomerDocument } from '../customers/customers.model';
import { sampleDefinition, SampleDocument } from '../samples/samples.model';

const name = 'contracts';

export type ContractBase = {
  customer: Partial<CustomerDocument>;
  samples: Partial<SampleDocument>[];

  sampleReceivedDate: Date;
  resultReturnDate: Date;

  customerId: string;
  date: string;

  note?: string;

  readBy: string[];

  updatedAt: Date;
};

export type ContractDocument = mongoose.Document & ContractBase;

export const contractSchema = new mongoose.Schema<ContractDocument>(
  {
    customer: customerDefinition,
    samples: [sampleDefinition],

    sampleReceivedDate: { type: Date, required: true },
    resultReturnDate: { type: Date, required: true },

    customerId: { type: String, required: true },

    readBy: [String],
    note: String,
  },
  { timestamps: true }
);

contractSchema.post('save', async function () {
  socket.emit('Refresh_Contracts');
});

export const Contract =
  (mongoose.connection.models[name] as mongoose.Model<ContractDocument>) ||
  mongoose.model<ContractDocument>(name, contractSchema);
