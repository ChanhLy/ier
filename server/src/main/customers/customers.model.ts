import mongoose from 'mongoose';
const name = 'customer';

export type CustomerDocument = mongoose.Document & {
  name: string;
  phone: string;
  address: string;
  tax?: string;
  representative?: string;
  fax?: string;
};

const customerSchema = new mongoose.Schema({}, { timestamps: true });

export const Customer = mongoose.connection.models[name] || mongoose.model<CustomerDocument>(name, customerSchema);
