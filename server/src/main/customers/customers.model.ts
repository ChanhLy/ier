import mongoose from 'mongoose';
const name = 'customer';

type CustomerBase = {
  name: string;
  phone: string;
  address: string;
  tax?: string;
  representative?: string;
  fax?: string;
};

export type CustomerDocument = mongoose.Document & CustomerBase;

export const customerDefinition: mongoose.SchemaDefinition = {
  name: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  tax: String,
  representative: String,
  fax: String,
};
const customerSchema = new mongoose.Schema(customerDefinition, { timestamps: true });

export const Customer = mongoose.connection.models[name] || mongoose.model<CustomerDocument>(name, customerSchema);
