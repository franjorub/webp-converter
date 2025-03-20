// src/controllers/healthController.ts
import { Request, Response } from 'express';

export const healthCheck = (req: Request, res: Response): void => {
  const healthData = {
    status: 'OK',
    uptime: process.uptime(),
    timestamp: Date.now(),
    environment: process.env.NODE_ENV ?? 'development',
  };

  res.status(200).json(healthData);
};
