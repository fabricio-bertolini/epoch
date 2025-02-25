import { Request, Response } from 'express';
import { viajanteRepository } from '../repositories/viajanteRepository';
import { infracaoRepository } from '../repositories/infracaoRepository';
import { Gravidade } from '../services/services';
import { parseISO } from 'date-fns';
import { BadRequestError, NotFoundError} from '../helpers/api-errors';
import { fiscalRepository } from '../repositories/fiscalRespository';
import { viagemRepository } from '../repositories/viagemRepository';

export class InfracaoController {
  async listInfracao(req: Request, res: Response) {
    const { viajanteId } = req.params;
    const infracoes = await infracaoRepository.find({ where: { viajante: { id: Number(viajanteId) } } });
    return res.json(infracoes);
  }

  async getInfracao(req: Request, res: Response) {
    const { viajanteId, infracaoId } = req.params;
    const infracao = await infracaoRepository.findOne({ where: { id: Number(infracaoId), viajante: { id: Number(viajanteId) } } });
    if (!infracao) {
      throw new NotFoundError('Infração não encontrada');
    }
    return res.json(infracao);
  }

  async createInfracao(req: Request, res: Response) {
    const { viajanteId, viagemId, fiscalId } = req.params;
    const { descricao, data, gravidade } = req.body;

    const viajante = await viajanteRepository.findOneBy({ id: Number(viajanteId) });
    if (!viajante) {
      throw new NotFoundError('Viajante não encontrado');
    }

    const fiscal = await fiscalRepository.findOneBy({ id: Number(fiscalId) });
    if (!fiscal) {
      throw new NotFoundError('Fiscal não encontrado');
    }

    const viagem = await viagemRepository.findOne({ where: { id: Number(viagemId), viajante: { id: Number(viajanteId) } }});
    if (!viagem) { 
      throw new NotFoundError('Viagem não encontrada');
    }

    if(!data) {
      throw new BadRequestError('Data não pode ser vazia.');
    }
    const parsedDate = parseISO(data);
    if (isNaN(parsedDate.getTime())) {
      throw new BadRequestError('Data de infração inválida');
    }

    if (!gravidade) {
      throw new BadRequestError('Gravidade não pode ser vazia.');
    }
    const validGravidades = Object.values(Gravidade);
    if (!validGravidades.includes(gravidade.toUpperCase() as Gravidade)) {
      throw new BadRequestError('Gravidade inválida');
    }

    const infracao = infracaoRepository.create({
      descricao,
      data: parsedDate,
      gravidade: gravidade.toUpperCase(),
      viajante,
      fiscal,
      viagem
    });
    await infracaoRepository.save(infracao);
    return res.status(201).json(infracao);
  }

  async updateInfracao(req: Request, res: Response) {
    const { viajanteId, infracaoId } = req.params;
    const { descricao, data, gravidade } = req.body;
    const infracao = await infracaoRepository.findOne({ where: { id: Number(infracaoId), viajante: { id: Number(viajanteId) } } });
    const viajante = await viajanteRepository.findOneBy({ id: Number(viajanteId) });

    if (!infracao) {
      throw new NotFoundError('Infração não encontrada');
    }
    if (!viajante )
    {
      throw new NotFoundError('Viajante não encontrado');
    }

    if (descricao) {
      if ( descricao == infracao.descricao) throw new BadRequestError('Mesmo valor de Descricao já cadastrada na mesma infracao');
      infracao.descricao = descricao;
    }

    if (data) {
      const parsedDate = parseISO(data);
      if (isNaN(parsedDate.getTime())) {
        throw new BadRequestError('Data de infração inválida');
      }
      if ( parseISO(data) == infracao.data) throw new BadRequestError('Mesmo valor de Data já cadastrada na mesma infracao');
      infracao.data = parsedDate;
    }

    if (gravidade) {
      const validGravidades = Object.values(Gravidade);
      if (!validGravidades.includes(gravidade.toUpperCase() as Gravidade)) {
        throw new BadRequestError('Gravidade inválida');
      }
      if ( gravidade.toUpperCase() == infracao.gravidade) throw new BadRequestError('Mesmo valor de Gravidade já cadastrada na mesma infracao');
      infracao.gravidade = gravidade.toUpperCase();
    }
    
    await infracaoRepository.save(infracao);
    return res.status(200).json(infracao);
  }

  async deleteInfracao(req: Request, res: Response) {
    const { viajanteId, infracaoId } = req.params;
    const infracao = await infracaoRepository.findOne({ where: { id: Number(infracaoId), viajante: { id: Number(viajanteId) } } });
    if (!infracao) {
      throw new NotFoundError('Infração não encontrada');
    }
    await infracaoRepository.remove(infracao);
    return res.status(200).json({ message: 'Infração deletada com sucesso' });
  }
}
