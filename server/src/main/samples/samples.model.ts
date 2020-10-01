import mongoose, { Schema, SchemaDefinition } from 'mongoose';
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

  readBy: string[];

  updatedAt: Date;
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
  readBy: [String],
  note: String,
  contract: { type: Schema.Types.ObjectId, ref: 'contracts' },
  experiments: [{ type: Schema.Types.ObjectId, ref: 'experiments' }],
};

export const sampleSchema = new mongoose.Schema<SampleDocument>(sampleDefinition, { timestamps: true });

export const Sample =
  (mongoose.connection.models[name] as mongoose.Model<SampleDocument>) ||
  mongoose.model<SampleDocument>(name, sampleSchema);
