import { Request, Response } from 'express';
import { viajanteRepository } from '../repositories/viajanteRepository';
import { viagemRepository } from '../repositories/viagemRepository';
import { parseISO } from 'date-fns';
import { VerificacaoNascimento, VerificacaoPontos } from '../services/services';
import { infracaoRepository } from '../repositories/infracaoRepository';
import { BadRequestError, NotFoundError, UnauthorizedError } from '../helpers/api-errors';

export class ViagemController {
  async listViagem(req: Request, res: Response) {
    const { viajanteId } = req.params;
    const viagens = await viagemRepository.find({ where: { viajante: { id: Number(viajanteId) } } });
    return res.json(viagens);
  }

  async getViagem(req: Request, res: Response) {
    const { viagemId, viajanteId } = req.params;
    const viagem = await viagemRepository.findOne({ where: { id: Number(viagemId), viajante: { id: Number(viajanteId) } } });
    if (!viagem) {
      throw new NotFoundError('Viagem não encontrada.');
    }
    return res.json(viagem);
  }

  async createViagem(req: Request, res: Response) {
    const { viajanteId, infracaoId } = req.params;
    const { descricao, dataDestino } = req.body;
    const viajante = await viajanteRepository.findOneBy({ id: Number(viajanteId) });
    const infracao = await infracaoRepository.findOne({ where: { id: Number(infracaoId), viajante: { id: Number(viajanteId) } } });
    const infracoes = await infracaoRepository.find({ where: { viajante: { id: Number(viajanteId) } } });

    if (!viajante) {
      throw new NotFoundError('Viajante não encontrado.');
    }

    if (!dataDestino) {
      throw new BadRequestError('Data de destino não pode ser vazia.');
    }

    const parsedDataDestino = parseISO(dataDestino);

    if (isNaN(parsedDataDestino.getTime())) {
      throw new BadRequestError('Data de destino inválida.');
    }

    if (VerificacaoPontos.verificarInfracaoUltimos12Meses(infracoes)) {
      throw new UnauthorizedError('Viajante não pode viajar pois cometeu 12 pontos de infrações nos últimos 12 meses.');
    }

    if (VerificacaoNascimento.verificar(parseISO(viajante.dataNascimento.toISOString()), parseISO(parsedDataDestino.toISOString()))) {
      throw new BadRequestError('Data destino de viagem inválida: não é possível viajar para data anterior da data de nascimento do viajante.');
    }

    if (VerificacaoPontos.verificarInfracaoAnteriorDepois(infracoes, parsedDataDestino)) {
      throw new UnauthorizedError(`Viajante não pode viajar pois cometeu infrações um ano antes e/ou depois da data: ${dataDestino}`);
    }

    const viagem = viagemRepository.create({
      descricao,
      dataDestino: parsedDataDestino,
      dataDaViagem: new Date(),
      viajante,
      infracao: infracao || null
    });
    await viagemRepository.save(viagem);
    return res.status(201).json(viagem);
  }

  async updateViagem(req: Request, res: Response) {
    const { viagemId, viajanteId } = req.params;
    const { descricao, dataDestino } = req.body;
    const viagem = await viagemRepository.findOne({ where: { id: Number(viagemId), viajante: { id: Number(viajanteId) } } });
    const viajante = await viajanteRepository.findOneBy({ id: Number(viajanteId) });
    const infracoes = await infracaoRepository.find({ where: { viajante: { id: Number(viajanteId) } } });

    if (!viagem) {
      throw new NotFoundError('Viagem não encontrada.');
    }

    if (!viajante) {
      throw new NotFoundError('Viajante não encontrado.');
    }

    if (descricao) {
      if ( descricao == viagem.descricao) throw new BadRequestError('Mesmo valor de Descricao já cadastrada na mesma viagem');
      viagem.descricao = descricao;
    }

    if (dataDestino) {
      if (parseISO(dataDestino) == viagem.dataDestino) throw new BadRequestError('Mesmo valor de DataDestino já cadastrada na mesma viagem');

      const parsedDate = parseISO(dataDestino);

      if (isNaN(parsedDate.getTime())) {
        throw new BadRequestError('Data de viagem inválida.');
      }

      if (VerificacaoPontos.verificarInfracaoAnteriorDepois(infracoes, parsedDate)) {
        throw new UnauthorizedError(`Viajante não pode viajar pois cometeu infrações um ano antes e/ou depois da data: ${parsedDate}`);
      }

      if (VerificacaoNascimento.verificar(viajante.dataNascimento, parsedDate)) {
        throw new BadRequestError('Data destino de viagem inválida: não é possível viajar para data anterior da data de nascimento do viajante.');
      }

      viagem.dataDestino = parsedDate;
    }

    await viagemRepository.save(viagem);
    return res.status(200).json(viagem);
  }

  async deleteViagem(req: Request, res: Response) {
    const { viagemId, viajanteId } = req.params;
    const viagem = await viagemRepository.findOne({ where: { id: Number(viagemId), viajante: { id: Number(viajanteId) } } });
    if (!viagem) {
      throw new NotFoundError('Viagem não encontrada');
    }
    await viagemRepository.remove(viagem);
    return res.status(200).json({ message: 'Viagem deletada com sucesso' });
  }
}
