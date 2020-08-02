import Router from '@koa/router';
import { contractRoutes } from '../main/contracts/contracts.routes';

const router = new Router({ prefix: '/api' });

router.use(contractRoutes);

export const apiRoutes = router.routes();
