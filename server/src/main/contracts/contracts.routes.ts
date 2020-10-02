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
  const contract = ctx.request.body;
  const samples = ctx.request.body.samples as SampleBase[];
  const customer = ctx.request.body.customer;

  // Create customer
  const customerId = customer._id || (await customerService.createCustomer(customer))._id;

  // Create contract
  const contractId = (await contractService.createContract({ ...contract, customer: customerId }))._id;

  for (const sample of samples) {
    // Create samples
    sample.contract = contractId;
    const sampleId = (await sampleService.createSample(sample))._id;

    // Create experiments
    const experiments = sample.experiments.map((experiment) => ({ ...experiment, sample: sampleId }));
    await experimentService.createExperiments(experiments);
  }

  ctx.response.status = httpStatus.CREATED;
});

contractRouter.put('/:id', async (ctx) => {
  const id = ctx.params.id as string;
  const contract = await contractService.updateContractById(id, ctx.request.body);
  ctx.response.body = contract;
});

export const contractRoutes = contractRouter.routes();
