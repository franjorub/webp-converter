import { Response } from 'express';

export const errorHandler = (error: Error, res: Response): void => {
  console.error('Server error:', error);
  res.status(500).send('Something went wrong on the server');
};
