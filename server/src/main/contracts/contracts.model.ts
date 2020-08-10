import dayjs from 'dayjs';
import mongoose from 'mongoose';
import { socket } from '../..';
import { customerDefinition, CustomerDocument } from '../customers/customers.model';

const name = 'contracts';

export type ContractDocument = mongoose.Document & {
  customer: Partial<CustomerDocument>;

  samplingLocation: string;
  sampleReceivedDate: Date;
  resultReturnDate: Date;

  numberInMonth: number;
  date: string;

  note?: string;

  readBy: string[];

  updatedAt: Date;
};

export const contractSchema = new mongoose.Schema<ContractDocument>(
  {
    customer: customerDefinition,

    samplingLocation: { type: String, required: true },
    sampleReceivedDate: { type: Date, required: true },
    resultReturnDate: { type: Date, required: true },

    numberInMonth: { type: Number, required: true, default: 1 },

    date: {
      type: String,
      required: true,
      default: dayjs().format('YYYYMMDD'),
    },

    readBy: [String],
    note: String,
  },
  { timestamps: true }
);

contractSchema.pre<ContractDocument>('save', async function () {
  this.numberInMonth =
    this.numberInMonth || (await Contract.find({ date: dayjs().format('YYYYMMDD') }).exec()).length + 1;
});

contractSchema.post('save', async function () {
  socket.emit('Refresh_Contracts');
});

export const Contract =
  (mongoose.connection.models[name] as mongoose.Model<ContractDocument>) ||
  mongoose.model<ContractDocument>(name, contractSchema);

setInterval(() => {
  socket.emit('hello');
}, 1000);
