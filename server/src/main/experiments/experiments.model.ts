import mongoose, { SchemaDefinition } from 'mongoose';
const name = 'experiments';

export type ExperimentBase = {
  target: string;
  methods: string[];
};

export type ExperimentDocument = mongoose.Document & ExperimentBase;

export const experimentDefinition: SchemaDefinition = {
  target: String,
  methods: [String],
};

export const experimentSchema = new mongoose.Schema<ExperimentDocument>(experimentDefinition, { timestamps: true });

export const Experiment =
  (mongoose.connection.models[name] as mongoose.Model<ExperimentDocument>) ||
  mongoose.model<ExperimentDocument>(name, experimentSchema);
