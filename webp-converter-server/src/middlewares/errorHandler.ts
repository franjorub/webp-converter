import { Response, Request, NextFunction } from 'express';

export const errorHandler = (
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error('Server error:', error);

  res.status(500).send('Something went wrong on the server');
};
