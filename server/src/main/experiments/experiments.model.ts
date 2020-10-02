import mongoose, { SchemaDefinition } from 'mongoose';
import { SampleDocument } from '../samples/samples.model';
const name = 'experiments';

export type ExperimentBase = {
  target: string;
  methods: string[];
  sample: Partial<SampleDocument>;
};

export type ExperimentDocument = mongoose.Document & ExperimentBase;

export const experimentDefinition: SchemaDefinition = {
  target: String,
  methods: [String],
  sample: { type: String, ref: 'sample' },
};

export const experimentSchema = new mongoose.Schema<ExperimentDocument>(experimentDefinition, { timestamps: true });

export const Experiment =
  (mongoose.connection.models[name] as mongoose.Model<ExperimentDocument>) ||
  mongoose.model<ExperimentDocument>(name, experimentSchema);
