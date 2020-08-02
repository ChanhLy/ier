import Application = require('koa');
import koaBodyParser = require('koa-body');
import koaLogger = require('koa-logger');
import Router from '@koa/router';
import compress from 'koa-compress';
import { apiRoutes } from './routes';
import koaSession = require('koa-session');
import httpStatus = require('http-status');
const router = new Router({ prefix: '/api' });
router.get('/contracts', (ctx) => (ctx.body = 'a'));
const app = new Application();

app.keys = [process.env.SECRET || 'laptop key secrets'];

app.use(koaSession(app));
app.use(koaLogger());
app.use(koaBodyParser());
if (process.env.NODE_ENV !== 'production') {
  app.use(compress());
}

app.use(async (context, next) => {
  context.state.user = {
    id: '1',
    username: 'admin',
  };
  await next();
});

app.use(async (context, next) => {
  try {
    await next();
  } catch (error) {
    context.throw(httpStatus.INTERNAL_SERVER_ERROR, error);
  }
});

app.use(apiRoutes);

export default app;
