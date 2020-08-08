import Router from '@koa/router';
import { contractRoutes } from '../main/contracts';
import { customerRoutes } from '../main/customers';

const router = new Router({ prefix: '/api' });

router.use(contractRoutes);
router.use(customerRoutes);

export const apiRoutes = router.routes();
