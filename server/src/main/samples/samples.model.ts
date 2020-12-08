import mongoose, { Schema, SchemaDefinition } from 'mongoose';
import { socket } from '../..';
import { ContractBase, ContractDocument } from '../contracts/contracts.model';
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
  paid?: boolean;
  returned?: boolean;

  readBy: string[];

  updatedAt: Date;
  deletedAt?: Date;
  contract: string | ContractBase | ContractDocument;
};

export type SampleDocument = mongoose.Document & SampleBase;

export const sampleDefinition: SchemaDefinition = {
  _id: { type: String, required: true },
  symbol: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String, required: true },
  amount: String,
  unit: String,
  type: { type: String, required: true },
  readBy: { type: [String], default: [] },
  note: String,
  contract: { type: Schema.Types.ObjectId, ref: 'contracts' },
  deletedAt: Date,
  paid: Boolean,
  returned: Boolean,
};

export const sampleSchema = new mongoose.Schema<SampleDocument>(sampleDefinition, { timestamps: true });

sampleSchema.post('save', async function () {
  socket.emit('Refresh_Samples');
});

sampleSchema.post('insertMany', async function () {
  socket.emit('Refresh_Samples');
});

sampleSchema.post('updateOne', async function () {
  socket.emit('Refresh_Samples');
});

export const Sample =
  (mongoose.connection.models[name] as mongoose.Model<SampleDocument>) ||
  mongoose.model<SampleDocument>(name, sampleSchema);
