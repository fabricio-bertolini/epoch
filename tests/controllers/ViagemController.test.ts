import { ViagemController } from '../../src/controllers/ViagemController';
import { Request, Response } from 'express';
import { viagemRepository } from '../../src/repositories/viagemRepository';
import { viajanteRepository } from '../../src/repositories/viajanteRepository';
import { infracaoRepository } from '../../src/repositories/infracaoRepository';
import { VerificacaoNascimento, VerificacaoPontos } from '../../src/services/services';
import { BadRequestError, NotFoundError, UnauthorizedError } from '../../src/helpers/api-errors';

jest.mock('../../src/repositories/viagemRepository');
jest.mock('../../src/repositories/viajanteRepository');
jest.mock('../../src/repositories/infracaoRepository');
jest.mock('../../src/services/services');

describe('ViagemController', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let controller: ViagemController;

  beforeEach(() => {
    req = {};
    res = {
      json: jest.fn().mockReturnValue(res),
      status: jest.fn().mockReturnValue(res),
    };
    controller = new ViagemController();
  });

  it('should list viagens for a viajante', async () => {
    const viagens = [{ id: 1, descricao: 'Test' }];
    (viagemRepository.find as jest.Mock).mockResolvedValue(viagens);
    req.params = { viajanteId: '1' };

    await controller.listViagem(req as Request, res as Response);

    expect(viagemRepository.find).toHaveBeenCalledWith({ where: { viajante: { id: 1 } } });
    expect(res.json).toHaveBeenCalledWith(viagens);
  });

  it('should return 404 if viagem not found', async () => {
    (viagemRepository.findOne as jest.Mock).mockResolvedValue(null);
    req.params = { viagemId: '1', viajanteId: '1' };

    await expect(controller.getViagem(req as Request, res as Response)).rejects.toThrow(NotFoundError);
  });

  // ...additional tests for other methods...
});
