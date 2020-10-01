import dayjs from 'dayjs';
import mongoose, { Model } from 'mongoose';
const name = 'customer';

export type CustomerBase = {
  _id: string;
  name: string;
  phone: string;
  address: string;
  tax?: string;
  representative?: string;
  fax?: string;

  createdAt: Date;
  updatedAt: Date;
};

export type CustomerDocument = mongoose.Document & CustomerBase;

export const customerDefinition: mongoose.SchemaDefinition = {
  _id: { type: String, required: true },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  tax: String,
  representative: String,
  fax: String,
};
const customerSchema = new mongoose.Schema(customerDefinition, { timestamps: true });

customerSchema.pre<CustomerDocument>('build', async function () {
  this._id =
    (
      await Customer.find({ createdAt: { $gt: dayjs().startOf('d').toDate() } })
        .select('_id')
        .exec()
    ).length + 1;
});

export const Customer =
  (mongoose.connection.models[name] as Model<CustomerDocument>) ||
  mongoose.model<CustomerDocument>(name, customerSchema);
