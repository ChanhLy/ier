import Router from '@koa/router';
import { authorizeRoles } from '../../app/auth';
import { UserService } from './users.service';

const userRouter = new Router({ prefix: '/users' });
userRouter.use(authorizeRoles(['admin']));

const userService = new UserService();
export const userRoutes = userRouter.routes();
