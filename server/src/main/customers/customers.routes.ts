import Router from '@koa/router';
import httpStatus from 'http-status';
import { CustomerService } from './customers.service';

const customerService = new CustomerService();

const customerRouter = new Router({ prefix: '/customers' });

customerRouter.get('/id', async (ctx) => {
  const customers = await customerService.findCustomers(ctx.query, '_id');
  ctx.response.body = customers.map((customer) => customer.toJSON()._id);
});

customerRouter.get('/', async (ctx) => {
  const customers = await customerService.findCustomers(ctx.query);
  ctx.response.body = customers;
});

customerRouter.put('/', async (ctx) => {
  const customer = await customerService.updateCustomer(ctx.query, ctx.request.body);
  if (!customer) {
    ctx.throw(httpStatus.NOT_FOUND);
  }
  ctx.response.body = customer;
});

customerRouter.put('/:id', async (ctx) => {
  const id = ctx.params.id as string;
  const customer = await customerService.updateCustomerById(id, ctx.request.body);
  if (!customer) {
    ctx.throw(httpStatus.NOT_FOUND);
  }
  ctx.response.body = customer;
});

export const customerRoutes = customerRouter.routes();
