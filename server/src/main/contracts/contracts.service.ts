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

  async findContractById(_id: string): Promise<ContractDocument | null> {
    const contractDocument = (
      await Contract.findOne({ _id, deletedAt: undefined }).populate({ path: 'customer', model: Customer }).exec()
    );
    if (contractDocument) {
      const contract = contractDocument.toJSON();
      const samples = (await Sample.find({ contract: contract._id, deletedAt: undefined }).exec()).map((sample) =>
        sample.toJSON()
      );
      contract.samples = await Promise.all(
        samples.map(async (sample) => {
          const experiments = (
            await Experiment.find({ sample: sample._id, deletedAt: undefined }).exec()
          ).map((experiment) => experiment.toJSON());
          return { ...sample, experiments };
        })
      );
    }
    return contractDocument;
  }

  async findContractsLastThreeMonths(
    condition?: FilterQuery<ContractDocument>,
    projection?: Partial<ContractDocument> | null,
    options?: QueryFindOptions
  ): Promise<ContractDocument[]> {
    return Contract.find(
      { ...condition, createdAt: { $gt: dayjs().subtract(3, 'month').startOf('month') }, deletedAt: undefined },
      projection,
      options
    ).sort({
      updatedAt: -1,
    });
  }

  async findContracts(
    condition?: FilterQuery<ContractDocument>,
    projection?: keyof ContractDocument | null,
    options?: QueryFindOptions
  ): Promise<ContractDocument[]> {
    return Contract.find({ ...condition, deletedAt: undefined }, projection, { ...options, limit: 1000 })
      .populate({ path: 'customer', model: Customer })
      .sort({
        updatedAt: -1,
      });
  }

  async findContractIds(): Promise<ContractDocument[]> {
    return Contract.find({}, '_id', { limit: 1000 }).populate({ path: 'customer', model: Customer }).sort({
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
