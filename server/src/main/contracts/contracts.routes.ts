import Router from '@koa/router';
import httpStatus from 'http-status';
import { SampleService } from '../samples';
import { SampleBase } from '../samples/samples.model';
import { ContractService } from './contracts.service';

const contractService = new ContractService();
const sampleService = new SampleService();

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
  const samplesValue = ctx.request.body.samples as SampleBase[];
  for (const sample of samplesValue) await sampleService.createSample(sample);

  const contract = await contractService.createContract(ctx.request.body);
  ctx.response.status = httpStatus.CREATED;
  ctx.response.body = contract;
});

contractRouter.put('/:id', async (ctx) => {
  const id = ctx.params.id as string;
  const contract = await contractService.updateContractById(id, ctx.request.body);
  ctx.response.body = contract;
});

export const contractRoutes = contractRouter.routes();
