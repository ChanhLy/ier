import Router from '@koa/router';
import httpStatus from 'http-status';
import { ContractService } from './contracts.service';

const contractService = new ContractService();

const contractRouter = new Router({ prefix: '/contracts' });

contractRouter.get('/', async (ctx) => {
  const contracts = await contractService.findContracts({});
  ctx.response.body = contracts;
});

contractRouter.post('/', async (ctx) => {
  const contract = await contractService.createContract(ctx.request.body);
  ctx.response.status = httpStatus.CREATED;
  ctx.response.body = contract;
});

export const contractRoutes = contractRouter.routes();
