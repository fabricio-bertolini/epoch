import { InfracaoController } from '../../src/controllers/InfracaoController';
import { Request, Response } from 'express';
import { infracaoRepository } from '../../src/repositories/infracaoRepository';
import { viajanteRepository } from '../../src/repositories/viajanteRepository';
import { fiscalRepository } from '../../src/repositories/fiscalRespository';
import { viagemRepository } from '../../src/repositories/viagemRepository';
import { Gravidade } from '../../src/services/services';
import { BadRequestError, NotFoundError } from '../../src/helpers/api-errors';

jest.mock('../../src/repositories/infracaoRepository');
jest.mock('../../src/repositories/viajanteRepository');
jest.mock('../../src/repositories/fiscalRespository');
jest.mock('../../src/repositories/viagemRepository');

describe('InfracaoController', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let controller: InfracaoController;

  beforeEach(() => {
    req = {};
    res = {
      json: jest.fn().mockReturnValue(res),
      status: jest.fn().mockReturnValue(res),
    };
    controller = new InfracaoController();
  });

  it('should list infracoes for a viajante', async () => {
    const infracoes = [{ id: 1, descricao: 'Test' }];
    (infracaoRepository.find as jest.Mock).mockResolvedValue(infracoes);
    req.params = { viajanteId: '1' };

    await controller.listInfracao(req as Request, res as Response);

    expect(infracaoRepository.find).toHaveBeenCalledWith({ where: { viajante: { id: 1 } } });
    expect(res.json).toHaveBeenCalledWith(infracoes);
  });

  it('should return 404 if infracao not found', async () => {
    (infracaoRepository.findOne as jest.Mock).mockResolvedValue(null);
    req.params = { infracaoId: '1', viajanteId: '1' };

    await expect(controller.getInfracao(req as Request, res as Response)).rejects.toThrow(NotFoundError);
  });

  // ...additional tests for other methods...
});
