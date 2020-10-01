import Router from '@koa/router';
import httpStatus from 'http-status';
import { CustomerService } from '../customers/customers.service';
import { ExperimentService } from '../experiments/experiments.service';
import { SampleService } from '../samples';
import { SampleBase } from '../samples/samples.model';
import { ContractService } from './contracts.service';

const contractService = new ContractService();
const sampleService = new SampleService();
const customerService = new CustomerService();
const experimentService = new ExperimentService();

const contractRouter = new Router({ prefix: '/contracts' });

contractRouter.get('/:id', async (ctx) => {
  const contract = await contractService.findContractById(ctx.params.id);
  if (contract) await contractService.addReadByUser(contract, ctx.state.user.id);

  ctx.response.body = contract;
});

contractRouter.get('/', async (ctx) => {
  const contracts = await contractService.findContracts();
  ctx.response.body = contracts;
});

contractRouter.get('/lastThreeMonths', async (ctx) => {
  const contracts = await contractService.findContractsLastThreeMonths();
  ctx.response.body = contracts;
});

contractRouter.post('/', async (ctx) => {
  const contractValue = ctx.request.body;
  const samplesValue = ctx.request.body.samples as SampleBase[];
  const customerValue = ctx.request.body.customer;

  delete contractValue.samples;
  delete contractValue.customer;
  const contract = await contractService.createContract(contractValue);
  const samples = [];
  for (const sample of samplesValue) {
    const experiments = (await experimentService.createExperiments(sample.experiments)).map(
      (experiment) => experiment._id
    );
    sample.contract = contract._id;
    sample.experiments = experiments;
    samples.push((await sampleService.createSample(sample))._id);
  }
  const customer = (await customerService.createCustomer(customerValue))._id;
  const body = await contractService.updateContractById(contract._id, { samples, customer });
  ctx.response.status = httpStatus.CREATED;
  ctx.response.body = body;
});

contractRouter.put('/:id', async (ctx) => {
  const id = ctx.params.id as string;
  const contract = await contractService.updateContractById(id, ctx.request.body);
  ctx.response.body = contract;
});

export const contractRoutes = contractRouter.routes();
