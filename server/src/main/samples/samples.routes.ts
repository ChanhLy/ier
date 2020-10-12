import Router from '@koa/router';
import httpStatus from 'http-status';
import { SampleService } from './samples.service';

const sampleRouter = new Router({ prefix: '/samples' });

const sampleService = new SampleService();

sampleRouter.post('/', async (ctx) => {
  const sample = await sampleService.createSample(ctx.request.body);
  if (!sample) {
    return ctx.throw(httpStatus.INTERNAL_SERVER_ERROR);
  }
  ctx.response.status = httpStatus.CREATED;
});

sampleRouter.get('/', async (ctx) => {
  const samples = await sampleService.findSamples(ctx.query);

  ctx.response.body = samples;
});

sampleRouter.delete('/:id', async (ctx) => {
  const deleted = await sampleService.deleteSampleById(ctx.params.id);
  if (!deleted) {
    return ctx.throw(httpStatus.NOT_FOUND);
  }
  ctx.response.status = httpStatus.OK;
});

export const sampleRoutes = sampleRouter.routes();
