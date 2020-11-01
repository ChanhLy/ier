import mongoose, { SchemaDefinition } from 'mongoose';
import { socket } from '../..';
import { SampleDocument } from '../samples/samples.model';
const name = 'experiments';

export type ExperimentBase = {
  target: string;
  methods: string[];
  unit: string;
  result: string;
  conductedBy: string;
  sample: Partial<SampleDocument>;
  readBy: string[];
  deletedAt: Date;
};

export type ExperimentDocument = mongoose.Document & ExperimentBase;

export const experimentDefinition: SchemaDefinition = {
  target: String,
  methods: [String],
  sample: { type: String, ref: 'sample' },
  unit: String,
  result: String,
  conductedBy: String,
  readBy: { type: [String], default: [] },
  deletedAt: Date,
};

export const experimentSchema = new mongoose.Schema<ExperimentDocument>(experimentDefinition, { timestamps: true });

experimentSchema.post('save', async function () {
  socket.emit('Refresh_Experiments');
});

experimentSchema.post('insertMany', async function () {
  socket.emit('Refresh_Experiments');
});

experimentSchema.post('updateOne', async function () {
  socket.emit('Refresh_Experiments');
});

experimentSchema.post('updateMany', async function () {
  socket.emit('Refresh_Experiments');
});

export const Experiment =
  (mongoose.connection.models[name] as mongoose.Model<ExperimentDocument>) ||
  mongoose.model<ExperimentDocument>(name, experimentSchema);
