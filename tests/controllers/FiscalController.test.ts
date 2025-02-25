import { FiscalController } from '../../src/controllers/FiscalController';
import { Request, Response } from 'express';
import { fiscalRepository } from '../../src/repositories/fiscalRespository';
import { VerificacaoCPF } from '../../src/services/services';
import { BadRequestError, NotFoundError } from '../../src/helpers/api-errors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

jest.mock('../../src/repositories/fiscalRespository');
jest.mock('../../src/services/services');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('FiscalController', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let controller: FiscalController;

  beforeEach(() => {
    req = {};
    res = {
      json: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
    };
    controller = new FiscalController();
  });

  it('should get a fiscal by ID', async () => {
    const fiscal = { id: 1, nome: 'Test' };
    (fiscalRepository.findOneBy as jest.Mock).mockResolvedValue(fiscal);
    req.params = { fiscalId: '1' };

    await controller.getFiscal(req as Request, res as Response);

    expect(fiscalRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    expect(res.json).toHaveBeenCalledWith(fiscal);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('should return 404 if fiscal not found', async () => {
    (fiscalRepository.findOneBy as jest.Mock).mockResolvedValue(null);
    req.params = { fiscalId: '1' };

    await expect(controller.getFiscal(req as Request, res as Response)).rejects.toThrow(NotFoundError);
  });

  // ...additional tests for other methods...
});
