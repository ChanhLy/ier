import { FilterQuery, UpdateQuery } from 'mongoose';
import { Customer, CustomerDocument } from './customers.model';

export class CustomerService {
  findCustomers(conditions?: FilterQuery<CustomerDocument>): Promise<CustomerDocument[]> {
    const query = conditions || {};
    return Customer.find(query).exec();
  }

  async updateCustomer(
    conditions: FilterQuery<CustomerDocument>,
    update: UpdateQuery<CustomerDocument>
  ): Promise<CustomerDocument | null | undefined> {
    return Customer.findOneAndUpdate(conditions, update, { new: true });
  }

  async updateCustomerById(id: string, update: UpdateQuery<CustomerDocument>): Promise<CustomerDocument | null> {
    return Customer.findByIdAndUpdate(id, update);
  }
}
