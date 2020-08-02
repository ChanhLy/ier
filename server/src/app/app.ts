import Application = require('koa');
import koaBody = require('koa-body');
import koaLogger = require('koa-logger');
import * as httpStatus from 'http-status';
import koaSession = require('koa-session');

const app = new Application();

app.keys = [process.env.SECRET || 'laptop key secrets'];

app.use(koaSession(app));
app.use(koaLogger);
app.use(koaBody);

app.use(async (context, next) => {
  try {
    await next();
  } catch (error) {
    context.throw(httpStatus.INTERNAL_SERVER_ERROR, error);
  }
});

app.use((context, next) => {
  context.state.user = {
    id: 1,
    username: 'admin',
  };
  next();
});

app.use((context, next) => {
  context.assert(context.state.user, httpStatus.UNAUTHORIZED, 'User not found. Please login!');
  next();
});

export default app;
