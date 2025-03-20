import express from 'express';
import cors from 'cors';
import routes from '../routes';
import { errorHandler } from '../middlewares/errorHandler';

const createApp = () => {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.use('/api', routes);

  app.use(errorHandler);

  return app;
};

export default createApp;
