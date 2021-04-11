import { compareSync } from 'bcrypt';
import httpStatus from 'http-status';
import { Next } from 'koa';
import { Context } from 'vm';
import { UserService } from '../main/users/users.service';

export function authorizeRoles(roles: string[] = []): (ctx: Context, next: Next) => Promise<unknown> {
  return function authorize(ctx: Context, next: Next) {
    const userRole = ctx.session?.user?.role;

    if (userRole === 'admin' || roles.includes(userRole)) {
      return next();
    }

    return ctx.throw(httpStatus.UNAUTHORIZED);
  };
}

export async function login(ctx: Context): Promise<unknown> {
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
  const userSession = { username: user.username, role: user.role };
  if (ctx.session) ctx.session.user = userSession;
  ctx.response.body = userSession;
}

export async function authenticate(ctx: Context, next: Next): Promise<unknown> {
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
