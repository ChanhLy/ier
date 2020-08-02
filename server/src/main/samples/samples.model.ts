import dayjs from 'dayjs';
import mongoose from 'mongoose';

const name = 'samples';

export type SampleDocument = mongoose.Document & {
  date: string;
};

export const sampleSchema = new mongoose.Schema(
  {
    date: {
      type: String,
      required: true,
      default: dayjs().format('YYYYMM'),
    },
  },
  { timestamps: true }
);

export const Sample =
  (mongoose.connection.models[name] as mongoose.Model<SampleDocument>) ||
  mongoose.model<SampleDocument>(name, sampleSchema);
