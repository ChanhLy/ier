import dayjs from 'dayjs';
import { FilterQuery, UpdateQuery } from 'mongoose';
import { Customer, CustomerBase, CustomerDocument } from './customers.model';

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

  async createCustomer(data: CustomerBase): Promise<CustomerDocument> {
    const _id =
      (
        await Customer.find({ createdAt: { $gt: dayjs().startOf('d').toDate() } })
          .select('_id')
          .exec()
      ).length + 1;
    data._id = dayjs().format('YYYYMMDD') + _id;
    return Customer.create(data);
  }
}
