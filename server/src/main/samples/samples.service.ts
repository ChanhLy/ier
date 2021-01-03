import dayjs from 'dayjs';
import * as ExcelJS from 'exceljs';
import { NOT_FOUND } from 'http-status';
import { FilterQuery, QueryFindOptions } from 'mongoose';
import { ContractDocument } from '../contracts';
import { CustomerDocument } from '../customers/customers.model';
import { Experiment, ExperimentDocument } from '../experiments/experiments.model';
import { Sample, SampleBase, SampleDocument } from './samples.model';

export class SampleService {
  async returnedContract(id: string): Promise<SampleDocument> {
    const sample = await this.findSampleById(id);
    if (!sample) {
      throw NOT_FOUND;
    }
    return sample.update({ returned: !sample.returned }).exec();
  }
  async paidContract(id: string): Promise<SampleDocument> {
    const sample = await this.findSampleById(id);
    if (!sample) {
      throw NOT_FOUND;
    }
    return sample.update({ paid: !sample.paid }).exec();
  }
  async deleteSampleById(_id: string): Promise<number> {
    return Sample.updateOne({ _id }, { deletedAt: new Date() }).exec();
  }

  async updateSampleById(_id: string, data: Partial<SampleDocument>): Promise<SampleDocument | null> {
    return Sample.findByIdAndUpdate(_id, { ...data, readBy: [] }, {}).exec();
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

  async addReadByUser(sample: SampleDocument, userId: string): Promise<SampleDocument> {
    if (!sample.readBy.includes(userId)) {
      sample.readBy.push(userId);
      return sample.save({ timestamps: false });
    }
    return sample;
  }

  async updateSamples(query: any, update: Partial<SampleBase>): Promise<boolean> {
    await Sample.updateMany(query, update).exec();

    return true;
  }

  setFormData(
    workbook: ExcelJS.Workbook,
    sample: SampleDocument,
    customer: CustomerDocument,
    contract: ContractDocument,
    experiments: ExperimentDocument[]
  ): void {
    const sheet = workbook.getWorksheet(1);
    sheet.getCell('Q5').value = sample.id;
    sheet.getCell('D8').value = sample.location;
    sheet.getCell('D9').value = customer.address;
    sheet.getCell('D10').value = '';
    sheet.getCell('Q8').value = dayjs(contract.sampleReceivedDate).format('DD/MM/YYYY');
    sheet.getCell('Q9').value = sample.type;

    const today = new Date();
    sheet.getCell('L45').value = `Tp.HCM, ngày ${today.getDay()} tháng ${today.getMonth()} năm ${today.getFullYear()}`;

    experiments.forEach((experiment, i) => {
      const row = i * 2 + 13;
      sheet.getCell(`A${row}`).value = i;
      sheet.getCell(`B${row}`).value = experiment.target;
      sheet.getCell(`F${row}`).value = experiment.unit;
      sheet.getCell(`H${row}`).value = experiment.result;
      sheet.getCell(`L${row}`).value = experiment.methods.join(', ');
    });
  }
}
