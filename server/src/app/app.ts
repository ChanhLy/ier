import Application = require('koa');
import koaBodyParser = require('koa-body');
import koaLogger = require('koa-logger');
import httpStatus from 'http-status';
import compress from 'koa-compress';
import { apiRoutes } from './routes';
import koaSession = require('koa-session');
import Router = require('@koa/router');
import send = require('koa-send');
import serve = require('koa-static');

const app = new Application();

app.keys = [process.env.SECRET || 'laptop key secrets'];

app.use(koaSession(app));
app.use(koaLogger());
app.use(koaBodyParser());
app.use(serve('build'));
if (process.env.NODE_ENV !== 'production') {
  app.use(compress());
}

app.use(async (context, next) => {
  try {
    await next();
  } catch (error) {
    context.throw(httpStatus.INTERNAL_SERVER_ERROR, error);
  }
});

app.use(apiRoutes);

const clientRouter = new Router();
clientRouter.get('(.*)', async (ctx) => {
  await send(ctx, './', { root: './build', index: 'index.html' });
});
app.use(clientRouter.routes());

export default app;
