import Application = require('koa');
import koaBodyParser = require('koa-body');
import koaLogger = require('koa-logger');
import httpStatus from 'http-status';
import compress from 'koa-compress';
import { apiRoutes } from './routes';
import koaSession = require('koa-session');
import koaStatic = require('koa-static');
import path = require('path');

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
app.use(koaStatic(path.join(__dirname, '..', '..', 'build')));

export default app;
