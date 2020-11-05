import Router from '@koa/router';
import httpStatus from 'http-status';
import { ExperimentService } from './experiments.service';

const experimentService = new ExperimentService();

const experimentRouter = new Router({ prefix: '/experiments' });

experimentRouter.get('/', async (ctx) => {
  const experiments = await experimentService.findExperiments(ctx.query);
  ctx.body = experiments;
});

experimentRouter.get('/:id', async (ctx) => {
  const experiment = await experimentService.findExperimentById(ctx.params.id);
  if (!experiment) return ctx.throw(httpStatus.NOT_FOUND);

  await experimentService.addReadByUser(experiment, ctx.session?.user.username);
  ctx.body = experiment;
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

experimentRouter.put('/seen', async (ctx) => {
  await experimentService.seenAllByUser(ctx.session?.user.username);
  ctx.response.status = httpStatus.OK;
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
