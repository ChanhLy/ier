import { ok, strictEqual } from 'assert';
import Axios from 'axios';
import dayjs from 'dayjs';
import { Customer } from '../customers/customers.model';
import { Contract, ContractDocument } from './contracts.model';
import { ContractService } from './contracts.service';

const mockContract: Partial<ContractDocument> = {
  customer: {
    name: 'customer name',
    phone: 'phone number',
    address: '123 address',
  },
  samplingLocation: 'vietnam',
  sampleReceivedDate: new Date(),
  resultReturnDate: new Date(),
};

describe('#Contracts', () => {
  describe('#Contracts Service', () => {
    let contractService = new ContractService();
    beforeEach(() => {
      contractService = new ContractService();
    });

    after(async () => {
      const promises = [Contract.deleteMany({}), Customer.deleteMany({})];
      await Promise.all(promises);
    });

    describe('#create', () => {
      it('can create a contract', async () => {
        const contract = await contractService.createContract(mockContract);

        ok(contract);
        strictEqual(contract.numberInMonth, 1);
        strictEqual(contract.date, dayjs().format('YYYYMMDD'));
      });
    });
    describe('#find', () => {
      it('can find find previously created contract', async () => {
        const contracts = await contractService.findContracts({});

        ok(contracts);
        ok(Array.isArray(contracts) && contracts.length);
      });
    });
  });
  describe('#Contracts Routes', () => {
    it('can get contracts', async () => {
      const response = await Axios.get('http://localhost:3000/api/contracts');

      ok(response && Array.isArray(response.data));
    });
    it('can create new Contract', async () => {
      const response = await Axios.post('http://localhost:3000/api/contracts');
      ok(response && response.data._id);
    });
  });
});
