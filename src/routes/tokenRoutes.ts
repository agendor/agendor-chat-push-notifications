import { Router } from 'express';
import { TokenController } from '../controllers/TokenController';

export const createTokenRouter = (controller: TokenController): Router => {
  const router = Router();

  router.post('/tokens', controller.upsert);

  return router;
};
