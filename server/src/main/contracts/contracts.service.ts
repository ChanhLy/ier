import dayjs from 'dayjs';
import { FilterQuery, QueryFindOptions } from 'mongoose';
import { Customer } from '../customers/customers.model';
import { Experiment } from '../experiments/experiments.model';
import { Sample } from '../samples';
import { Contract, ContractBase, ContractDocument } from './contracts.model';

export class ContractService {
  async createContract(data: ContractBase): Promise<ContractDocument> {
    return Contract.create(data);
  }

  async findContractById(id: string): Promise<ContractDocument | null> {
    return Contract.findById(id)
      .populate({ path: 'samples', model: Sample, populate: { path: 'experiments', model: Experiment } })
      .populate({ path: 'customer', model: Customer });
  }

  async findContractsLastThreeMonths(
    condition?: FilterQuery<ContractDocument>,
    projection?: Partial<ContractDocument> | null,
    options?: QueryFindOptions
  ): Promise<ContractDocument[]> {
    return Contract.find(
      { ...condition, createdAt: { $gt: dayjs().subtract(3, 'month').startOf('month') } },
      projection,
      options
    ).sort({
      updatedAt: -1,
    });
  }

  async findContracts(
    condition?: FilterQuery<ContractDocument>,
    projection?: Partial<ContractDocument> | null,
    options?: QueryFindOptions
  ): Promise<ContractDocument[]> {
    return Contract.find({ ...condition }, { ...projection }, { ...options, limit: 1000 })
      .populate({ path: 'customer', model: Customer })
      .sort({
        updatedAt: -1,
      });
  }

  async addReadByUser(contract: ContractDocument, userId: string): Promise<ContractDocument> {
    if (!contract.readBy.includes(userId)) {
      contract.readBy.push(userId);
      return contract.save({ timestamps: false });
    }
    return contract;
  }

  async updateContractById(id: string, data: Partial<ContractDocument>): Promise<ContractDocument | null> {
    return Contract.findByIdAndUpdate(id, data, { new: true, runValidators: true }).exec();
  }
}
