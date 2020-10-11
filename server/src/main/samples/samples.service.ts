import dayjs from 'dayjs';
import { FilterQuery, QueryFindOptions } from 'mongoose';
import { Experiment } from '../experiments/experiments.model';
import { Sample, SampleBase, SampleDocument } from './samples.model';

export class SampleService {
  async deleteSampleById(_id: string): Promise<number> {
    return Sample.updateOne({ _id }, { deletedAt: new Date() }).exec();
  }
  async createSample(value: SampleBase): Promise<SampleDocument> {
    const no =
      (
        await Sample.find({ createdAt: { $gt: dayjs().startOf('d').toDate() }, symbol: value.symbol })
          .select('_id')
          .exec()
      ).length + 1;
    value._id = dayjs().format('YYYYMMDD') + value.symbol + no.toString();

    const sample = await Sample.create(value);
    return sample.save();
  }

  async findSampleById(_id: string): Promise<SampleDocument | null> {
    return Sample.findOne({ _id, deletedAt: undefined }).populate({ path: 'experiments', model: Experiment });
  }

  async findSamples(
    condition: FilterQuery<SampleDocument>,
    projection?: Partial<SampleDocument> | null,
    options?: QueryFindOptions
  ): Promise<SampleDocument[]> {
    return Sample.find({ ...condition, deletedAt: undefined }, { ...projection }, { ...options, limit: 1000 })
      .sort({
        updatedAt: -1,
      })
      .populate({ path: 'experiments', model: Experiment });
  }

  async findSamplesLastThreeMonths(
    condition: FilterQuery<SampleDocument>,
    projection?: Partial<SampleDocument> | null,
    options?: QueryFindOptions
  ): Promise<SampleDocument[]> {
    return Sample.find(
      { ...condition, createdAt: { $gt: dayjs().subtract(3, 'month').startOf('month') }, deletedAt: undefined },
      { ...projection },
      { ...options }
    ).sort({
      updatedAt: -1,
    });
  }
}
