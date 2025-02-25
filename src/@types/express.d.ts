import { Fiscal } from '../entities/Fiscal';

declare global {
  namespace Express {
    interface Request {
      usuario: Partial<Fiscal>;
    }
  }
}