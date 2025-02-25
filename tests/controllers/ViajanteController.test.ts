import { ViajanteController } from '../../src/controllers/ViajanteController';
import { Request, Response } from 'express';
import { viajanteRepository } from '../../src/repositories/viajanteRepository';
import { VerificacaoPassaporte } from '../../src/services/services';
import { BadRequestError, NotFoundError } from '../../src/helpers/api-errors';

jest.mock('../../src/repositories/viajanteRepository');
jest.mock('../../src/services/services');

describe('ViajanteController', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let controller: ViajanteController;

  beforeEach(() => {
    req = {
      params: { viajanteId: '1' }
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    controller = new ViajanteController();
  });

  it('should get a viajante by ID', async () => {
    const viajante = { id: 1, nome: 'Test Viajante' };
    (viajanteRepository.findOneBy as jest.Mock).mockResolvedValue(viajante);

    await controller.getViajante(req as Request, res as Response);

    expect(viajanteRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(viajante);
  });

  it('should return 404 if viajante not found', async () => {
    (viajanteRepository.findOneBy as jest.Mock).mockResolvedValue(null);

    await expect(controller.getViajante(req as Request, res as Response)).rejects.toThrow(NotFoundError);
  });

  // ...additional tests for other methods...
});
