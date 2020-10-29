import Router from '@koa/router';
import httpStatus from 'http-status';
import { ExperimentService } from './experiments.service';

const experimentService = new ExperimentService();

const experimentRouter = new Router({ prefix: '/experiments' });

experimentRouter.get('/', async (ctx) => {
  const experiments = await experimentService.findExperiments(ctx.query);
  ctx.body = experiments;
});

experimentRouter.post('/', async (ctx) => {
  try {
    const experiment = await experimentService.createExperiment(ctx.request.body);
    if (experiment) {
      ctx.response.status = httpStatus.CREATED;
    } else {
      ctx.throw(httpStatus.INTERNAL_SERVER_ERROR);
    }
  } catch (error) {
    ctx.throw(error);
  }
});

experimentRouter.delete('/:id', async (ctx) => {
  try {
    await experimentService.deleteExperiment(ctx.params.id);
    ctx.response.status = httpStatus.OK;
  } catch (error) {
    ctx.throw(error);
  }
});

experimentRouter.put('/:id', async (ctx) => {
  try {
    await experimentService.updateExperiment(ctx.params.id, ctx.request.body);
    ctx.response.status = httpStatus.OK;
  } catch (error) {
    ctx.throw(error);
  }
});

export const experimentRoutes = experimentRouter.routes();
