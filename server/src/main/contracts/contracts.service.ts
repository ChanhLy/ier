import dayjs from 'dayjs';
import * as ExcelJS from 'exceljs';
import { NOT_FOUND } from 'http-status';
import { FilterQuery, QueryFindOptions } from 'mongoose';
import { Customer, CustomerBase } from '../customers/customers.model';
import { CustomerService } from '../customers/customers.service';
import { Experiment } from '../experiments/experiments.model';
import { ExperimentService } from '../experiments/experiments.service';
import { Sample, SampleService } from '../samples';
import { Contract, ContractBase, ContractDocument } from './contracts.model';

const customerService = new CustomerService();
const sampleService = new SampleService();
const experimentService = new ExperimentService();
export class ContractService {
  async createContract(data: ContractBase): Promise<ContractDocument> {
    return Contract.create(data);
  }

  async findContractById(_id: string): Promise<ContractDocument | null> {
    const contractDocument = await Contract.findOne({ _id, deletedAt: undefined })
      .populate({ path: 'customer', model: Customer })
      .exec();
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
    const contract = await Contract.findById(id).exec();

    contract && (await customerService.updateCustomerById(contract.customer as string, data.customer as CustomerBase));
    delete data.customer;
    return Contract.findByIdAndUpdate(id, data, { new: true, runValidators: true }).exec();
  }

  async paidContract(id: string): Promise<ContractDocument | null> {
    const contract = await this.findContractById(id);

    contract && (await contract.updateOne({ paid: !contract.paid }).exec());

    return this.findContractById(id);
  }

  async returnedContract(id: string): Promise<ContractDocument | null> {
    const contract = await this.findContractById(id);

    contract && (await contract.updateOne({ returned: !contract.returned }).exec());

    return this.findContractById(id);
  }

  async printContract(contractId: string): Promise<ExcelJS.Buffer> {
    const contract = await this.findContractById(contractId);
    if (!contract) {
      throw new Error(NOT_FOUND.toString());
    }

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(__dirname + '/contract.xlsx');

    const worksheet = workbook.getWorksheet(1);
    await this.setSheetData(worksheet, contract);

    const buffer = await workbook.xlsx.writeBuffer({ useStyles: true });
    return buffer;
  }

  async setSheetData(sheet: ExcelJS.Worksheet, contract: ContractDocument): Promise<void> {
    const { _id, name, tax, representative, phone, fax, address } = contract.customer as CustomerBase;
    const { location, sampleReceivedDate, resultReturnDate } = contract;

    sheet.getCell('A2').value = _id;
    sheet.getCell('D4').value = name;
    sheet.getCell('M4').value = tax;
    sheet.getCell('D5').value = representative;
    sheet.getCell('M5').value = phone;
    sheet.getCell('Q5').value = fax;
    sheet.getCell('D6').value = location;
    sheet.getCell('O6').value = dayjs(sampleReceivedDate).format('DD/MM/YYYY');
    sheet.getCell('D7').value = address;
    sheet.getCell('O7').value = dayjs(resultReturnDate).format('DD/MM/YYYY');

    const samples = await sampleService.findSamples({ contract: contract._id });
    for (let i = 0; i < samples.length; i++) {
      const row = i * 2 + 11;

      const sample = samples[i].toJSON();
      console.log(sample);

      sheet.getCell(`A${row}`).value = i + 1;
      sheet.getCell(`B${row}`).value = sample.symbol;
      sheet.getCell(`D${row}`).value = sample.location;
      sheet.getCell(`I${row}`).value = sample.amount;
      sheet.getCell(`K${row}`).value = sample.description;
      const experiments = await experimentService.findExperiments({ sample: sample._id });
      console.log(experiments);

      const targets = experiments.map((experiment) => experiment.target);
      sheet.getCell(`O${row}`).value = targets ? targets.join(',') + `(${targets.length})` : '';
    }
  }
}
