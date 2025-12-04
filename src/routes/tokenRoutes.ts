import { Router } from 'express';
import { TokenController } from '../controllers/TokenController';
import { authMiddleware } from '../middlewares/authMiddleware';

export const createTokenRouter = (controller: TokenController): Router => {
  const router = Router();

  router.post('/tokens', authMiddleware, controller.upsert);

  return router;
};
