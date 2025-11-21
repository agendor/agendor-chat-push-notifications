import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import { TokenController } from './controllers/TokenController';
import { createTokenRouter } from './routes/tokenRoutes';

export interface ApplicationDependencies {
  tokenController: TokenController;
}

export const createApp = ({ tokenController }: ApplicationDependencies) => {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get('/health', (_: Request, res: Response) => {
    res.json({ status: 'ok' });
  });

  app.use('/v1', createTokenRouter(tokenController));

  app.use((error: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  });

  return app;
};
