import dayjs from 'dayjs';
import { FilterQuery, QueryFindOptions } from 'mongoose';
import { Contract, ContractDocument } from './contracts.model';

export class ContractService {
  async createContract(data: Partial<ContractDocument>): Promise<ContractDocument> {
    const contract = new Contract(data);
    contract.numberInMonth = (await Contract.find({ date: dayjs().format('YYYYMMDD') })).length + 1;
    return contract.save();
  }

  async findContractById(id: string): Promise<ContractDocument | null> {
    const contract = await Contract.findById(id);
    return contract;
  }

  async findContracts(
    condition: FilterQuery<ContractDocument>,
    projection?: Partial<ContractDocument> | null,
    options?: QueryFindOptions
  ): Promise<ContractDocument[]> {
    const contracts = await Contract.find(condition, projection, options);
    return contracts;
  }
}
