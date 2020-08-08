import dayjs from 'dayjs';
import { FilterQuery, QueryFindOptions } from 'mongoose';
import { Contract, ContractDocument } from './contracts.model';

export class ContractService {
  lastSixMonths(): string {
    return dayjs().subtract(6, 'month').format('YYYYMMDD');
  }

  async createContract(data: Partial<ContractDocument>): Promise<ContractDocument> {
    const contract = new Contract(data);
    contract.numberInMonth = (await Contract.find({ date: dayjs().format('YYYYMMDD') }).exec()).length + 1;
    return contract.save();
  }

  async findContractById(id: string): Promise<ContractDocument | null> {
    return Contract.findById(id);
  }

  async findContracts(
    condition: FilterQuery<ContractDocument>,
    projection?: Partial<ContractDocument> | null,
    options?: QueryFindOptions
  ): Promise<ContractDocument[]> {
    return Contract.find({ ...condition, date: { $gt: this.lastSixMonths() } }, projection, options).sort({
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
