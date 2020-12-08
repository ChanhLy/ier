import Router, { RouterContext } from '@koa/router';
import httpStatus, { NOT_FOUND } from 'http-status';
import { socket } from '../..';
import { authorizeRoles } from '../../app/auth';
import { CustomerService } from '../customers/customers.service';
import { ExperimentService } from '../experiments/experiments.service';
import { SampleService } from '../samples';
import { SampleBase } from '../samples/samples.model';
import { ContractDocument } from './contracts.model';
import { ContractService } from './contracts.service';

const contractService = new ContractService();
const sampleService = new SampleService();
const customerService = new CustomerService();
const experimentService = new ExperimentService();

const contractRouter = new Router({ prefix: '/contracts' });

type ContractRouterContext = RouterContext<{ contract?: ContractDocument }>;

contractRouter.use(authorizeRoles());

contractRouter.put('/:id', async (ctx: ContractRouterContext) => {
  const id = ctx.params.id as string;
  const contract = await contractService.updateContractById(id, ctx.request.body);

  socket.emit('Refresh_Contracts');

  ctx.response.body = contract;
});

contractRouter.put('/:id/paid', async (ctx) => {
  const id: string = ctx.params.id;
  const contract = await contractService.paidContract(id);
  if (!contract) {
    return ctx.throw(NOT_FOUND);
  }

  await sampleService.updateSamples({ contract: id }, { paid: contract.paid });

  ctx.response.status = httpStatus.OK;
});

contractRouter.put('/:id/returned', async (ctx) => {
  const id: string = ctx.params.id;

  const contract = await contractService.returnedContract(id);
  if (!contract) {
    return ctx.throw(NOT_FOUND);
  }
  console.log(contract);

  await sampleService.updateSamples({ contract: id }, { returned: contract.returned });

  ctx.response.status = httpStatus.OK;
});

contractRouter.param('id', async (id, ctx: ContractRouterContext, next) => {
  const contract = await contractService.findContractById(id);
  if (!contract) {
    return ctx.throw(NOT_FOUND);
  }
  await contractService.addReadByUser(contract, ctx.session?.user.username);
  ctx.state.contract = contract;
  return next();
});

contractRouter.get('/:id', async (ctx: ContractRouterContext) => {
  ctx.response.body = ctx.state.contract;
});

contractRouter.get('/', async (ctx: ContractRouterContext) => {
  const contracts = await contractService.findContracts();
  ctx.response.body = contracts;
});

contractRouter.get('/lastThreeMonths', async (ctx: ContractRouterContext) => {
  const contracts = await contractService.findContractsLastThreeMonths();
  ctx.response.body = contracts;
});

contractRouter.post('/', async (ctx: ContractRouterContext) => {
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

  socket.emit('Refresh_Contracts');
  socket.emit('Refresh_Experiments');
  socket.emit('Refresh_Samples');

  ctx.response.status = httpStatus.CREATED;
});

contractRouter.get('/:id/print', async (ctx) => {
  const id: string = ctx.params.id;

  const buffer = await contractService.printContract(id);
  ctx.response.body = buffer;
});

export const contractRoutes = contractRouter.routes();
