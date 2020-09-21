import mongoose from 'mongoose';
import { socket } from '../..';
import { ExperimentBase } from '../experiments';

const name = 'samples';

export type SampleBase = {
  _id: string;
  symbol: string;
  location: string;
  description: string;
  amount?: string;
  unit?: string;
  type: string;
  experiments: ExperimentBase[];
  note: string;

  readBy: string[];

  updatedAt: Date;
};

export type SampleDocument = mongoose.Document & SampleBase;

export const sampleSchema = new mongoose.Schema<SampleDocument>(
  {
    _id: { type: String, required: true },
    symbol: { type: String, required: true },
    location: { type: String, required: true },
    description: { type: String, required: true },
    amount: String,
    unit: String,
    type: { type: String, required: true },
    readBy: [String],
    note: String,
  },
  { timestamps: true }
);

sampleSchema.post('save', async function () {
  socket.emit('Refresh_Contracts');
});

export const Sample =
  (mongoose.connection.models[name] as mongoose.Model<SampleDocument>) ||
  mongoose.model<SampleDocument>(name, sampleSchema);
