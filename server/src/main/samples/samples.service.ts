import dayjs from 'dayjs';
import { FilterQuery, QueryFindOptions } from 'mongoose';
import { Sample, SampleBase, SampleDocument } from './samples.model';

export class SampleService {
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

  async findSampleById(id: string): Promise<SampleDocument | null> {
    const sample = await Sample.findById(id).exec();
    return sample;
  }

  async findSamples(
    condition: FilterQuery<SampleDocument>,
    projection?: Partial<SampleDocument> | null,
    options?: QueryFindOptions
  ): Promise<SampleDocument[]> {
    return Sample.find({ ...condition }, { ...projection }, { ...options, limit: 1000 }).sort({
      updatedAt: -1,
    });
  }

  async findSamplesLastThreeMonths(
    condition: FilterQuery<SampleDocument>,
    projection?: Partial<SampleDocument> | null,
    options?: QueryFindOptions
  ): Promise<SampleDocument[]> {
    return Sample.find(
      { ...condition, createdAt: { $gt: dayjs().subtract(3, 'month').startOf('month') } },
      { ...projection },
      { ...options }
    ).sort({
      updatedAt: -1,
    });
  }
}
