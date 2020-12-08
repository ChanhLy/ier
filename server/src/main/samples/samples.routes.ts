import Router from '@koa/router';
import httpStatus, { NOT_FOUND } from 'http-status';
import { socket } from '../..';
import { authorizeRoles } from '../../app/auth';
import { SampleService } from './samples.service';

const sampleRouter = new Router({ prefix: '/samples' });
sampleRouter.use(authorizeRoles([]));

const sampleService = new SampleService();

sampleRouter.post('/', async (ctx) => {
  const sample = await sampleService.createSample(ctx.request.body);
  if (!sample) {
    return ctx.throw(httpStatus.INTERNAL_SERVER_ERROR);
  }
  socket.emit('Refresh_Samples');
  ctx.response.status = httpStatus.CREATED;
});

sampleRouter.get('/', async (ctx) => {
  const samples = await sampleService.findSamples(ctx.query);

  ctx.response.body = samples;
});

sampleRouter.get('/:id', async (ctx) => {
  const sample = await sampleService.findSampleById(ctx.params.id);
  if (!sample) return ctx.throw(httpStatus.NOT_FOUND);

  await sampleService.addReadByUser(sample, ctx.session?.user.username);
  ctx.response.body = sample;
});

sampleRouter.delete('/:id', async (ctx) => {
  const deleted = await sampleService.deleteSampleById(ctx.params.id);
  if (!deleted) {
    return ctx.throw(httpStatus.NOT_FOUND);
  }
  ctx.response.status = httpStatus.OK;
});

sampleRouter.put('/:id', async (ctx) => {
  const sample = await sampleService.updateSampleById(ctx.params.id, ctx.request.body);

  socket.emit('Refresh_Samples');

  ctx.response.body = sample;
});

sampleRouter.put('/:id/paid', async (ctx) => {
  const sample = await sampleService.paidContract(ctx.params.id);
  if (!sample) {
    return ctx.throw(NOT_FOUND);
  }

  ctx.response.status = httpStatus.OK;
});

sampleRouter.put('/:id/returned', async (ctx) => {
  const sample = await sampleService.returnedContract(ctx.params.id);
  if (!sample) {
    return ctx.throw(NOT_FOUND);
  }

  ctx.response.status = httpStatus.OK;
});

export const sampleRoutes = sampleRouter.routes();
