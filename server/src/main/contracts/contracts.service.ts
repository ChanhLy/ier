import dayjs from 'dayjs';
import { FilterQuery, QueryFindOptions } from 'mongoose';
import { Contract, ContractDocument } from './contracts.model';

export class ContractService {
  async createContract(data: Partial<ContractDocument>): Promise<ContractDocument> {
    const contract = new Contract(data);
    const no =
      (
        await Contract.find({ createdAt: { $gt: dayjs().startOf('d').toDate() } })
          .select('_id')
          .exec()
      ).length + 1;
    contract.customerId = dayjs().format('YYYYMMDD') + no.toString();
    return contract.save();
  }

  async findContractById(id: string): Promise<ContractDocument | null> {
    return Contract.findById(id);
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
    return Contract.find({ ...condition }, { ...projection }, { ...options, limit: 1000 }).sort({
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
