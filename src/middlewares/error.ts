import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../helpers/api-errors';

export const errorMiddleware = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({ message: err.message });
  }

  console.error(err);
  return res.status(500).json({ message: 'Erro interno do servidor' });
};

// export const errorMiddleware = (
//     error: Error & Partial<ApiError>, 
//     req: Request, 
//     res: Response, 
//     next: NextFunction
// ) => {
//     const statusCode = error.statusCode ?? 500;
//     const message = error.statusCode ? error.message : 'Internal Server Error';
//     res.status(statusCode).json({ message });
