import Router from '@koa/router';
import { contractRoutes } from '../main/contracts';
import { customerRoutes } from '../main/customers';
import { sampleRoutes } from '../main/samples/samples.routes';

const router = new Router({ prefix: '/api' });

router.use(contractRoutes);
router.use(sampleRoutes);
router.use(customerRoutes);

export const apiRoutes = router.routes();
