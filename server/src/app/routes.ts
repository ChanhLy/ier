import Router from '@koa/router';
import { compareSync } from 'bcrypt';
import httpStatus from 'http-status';
import { Context, Next } from 'koa';
import { contractRoutes } from '../main/contracts';
import { customerRoutes } from '../main/customers';
import { experimentRoutes } from '../main/experiments/experiment.routes';
import { sampleRoutes } from '../main/samples/samples.routes';
import { UserService } from '../main/users/users.service';

const router = new Router({ prefix: '/api' });

router.post('/login', login);
router.use(authenticate);

router.use(contractRoutes);
router.use(sampleRoutes);
router.use(customerRoutes);
router.use(experimentRoutes);

export const apiRoutes = router.routes();

async function login(ctx: Context) {
  const userService = new UserService();
  const user = await userService.findByUsername(ctx.request.body.username);

  if (!user) {
    return ctx.throw(httpStatus.UNAUTHORIZED);
  }

  const userPassword = user?.toJSON().password;
  if (!userPassword) {
    user.set('password', process.env.DEFAULT_PASSWORD || '123456');
    await user.save();
  } else if (!compareSync(ctx.request.body.password, userPassword)) {
    return ctx.throw(httpStatus.UNAUTHORIZED);
  }
  if (ctx.session) ctx.session.user = { username: user.username };
  ctx.response.status = httpStatus.OK;
}

async function authenticate(ctx: Context, next: Next) {
  const userService = new UserService();
  const username = ctx.session?.user?.username;
  if (!username) {
    return ctx.throw(httpStatus.UNAUTHORIZED);
  }
  const user = await userService.findByUsername(username);
  if (username !== user?.username) {
    return ctx.throw(httpStatus.UNAUTHORIZED);
  }
  return next();
}
