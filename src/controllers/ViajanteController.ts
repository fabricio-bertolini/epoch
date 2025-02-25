import { Request, Response } from 'express';
import { viajanteRepository } from '../repositories/viajanteRepository';
import { parseISO } from 'date-fns';
import { BadRequestError, NotFoundError } from '../helpers/api-errors';
import { VerificacaoPassaporte } from '../services/services';

export class ViajanteController {
  async getViajante(req: Request, res: Response) {
    const { viajanteId } = req.params;
    const viajante = await viajanteRepository.findOneBy({ id: Number(viajanteId) });
    if (!viajante) {
      throw new NotFoundError('Viajante não encontrado');
    }
    return res.status(200).json(viajante);
  }

  async getViajanteByNumeroDePassaporte(req: Request, res: Response) {
    const { numeroPassaporte } = req.params;
    const passaporteValido = VerificacaoPassaporte.validarPassaporte(numeroPassaporte);
    const viajante = await viajanteRepository.findOneBy({ numeroPassaporte: passaporteValido });
    if (!viajante) {
      throw new NotFoundError('Viajante não encontrado');
    }
    return res.status(200).json(viajante);
  }

  async listViajante(req: Request, res: Response) {
    const viajantes = await viajanteRepository.find();
    return res.status(200).json(viajantes);
  }

  async createViajante(req: Request, res: Response) {
    const { nome, dataNascimento, numeroPassaporte } = req.body;
    if (!nome) {
      throw new BadRequestError('Nome não pode ser vazio');
    }
    if (!dataNascimento) {
      throw new BadRequestError('Data de nascimento não pode ser vazia');
    }
    if (!numeroPassaporte) {
      throw new BadRequestError('Número de passaporte não pode ser vazio');
    }

    const parsedDate = parseISO(dataNascimento);

    if (isNaN(parsedDate.getTime())) {
      throw new BadRequestError('Data de nascimento inválida');
    }
    const passaporteValido = VerificacaoPassaporte.validarPassaporte(numeroPassaporte);
    const existingViajante = await viajanteRepository.findOneBy({ numeroPassaporte: passaporteValido });
    if (existingViajante) {
      throw new BadRequestError('Já existe um viajante com este número de passaporte');
    }
    const viajante = viajanteRepository.create({
      nome,
      dataNascimento: parsedDate,
      numeroPassaporte: passaporteValido
    });
    await viajanteRepository.save(viajante);
    return res.status(201).json(viajante);
  }

  async updateViajante(req: Request, res: Response) {
    const { viajanteId } = req.params;
    const { nome, dataNascimento, numeroPassaporte } = req.body;
    const viajante = await viajanteRepository.findOneBy({ id: Number(viajanteId) });
    if (!viajante) {
      throw new NotFoundError('Viajante não encontrado');
    }

    if (numeroPassaporte)
    {
      const passaporteValido = VerificacaoPassaporte.validarPassaporte(numeroPassaporte);
      if (passaporteValido === viajante.numeroPassaporte) {
        throw new BadRequestError('Número de passaporte já cadastrado para este viajante');
      }

      const existingViajante = await viajanteRepository.findOneBy({ numeroPassaporte: passaporteValido });
      if (existingViajante) {
        throw new BadRequestError('Já existe um viajante com este número de passaporte');
      }
      if (passaporteValido) {
        if (passaporteValido == viajante.numeroPassaporte) throw new BadRequestError('Mesmo valor de NumeroPassaporte já cadastrada no mesmo viajante');
        viajante.numeroPassaporte = passaporteValido;
      }
    }

    if (nome) {
      if (nome == viajante.nome) throw new BadRequestError('Mesmo valor de Nome já cadastrada no mesmo viajante');
      viajante.nome = nome;
    }

    if (dataNascimento) {
      if (parseISO(dataNascimento) == viajante.dataNascimento) throw new BadRequestError('Mesmo valor de DataNascimento já cadastrada no mesmo viajante');
      
      const parsedDate = parseISO(dataNascimento);
      if (isNaN(parsedDate.getTime())) {
        throw new BadRequestError('Data de nascimento inválida');
      }
      if (parsedDate !== viajante.dataNascimento) {
        viajante.dataNascimento = parsedDate;
      }
    }

    await viajanteRepository.save(viajante);
    return res.status(200).json(viajante);
  }

  async deleteViajante(req: Request, res: Response) {
    const { viajanteId } = req.params;
    const viajante = await viajanteRepository.findOneBy({ id: Number(viajanteId) });
    if (!viajante) {
      throw new NotFoundError('Viajante não encontrado');
    }
    await viajanteRepository.remove(viajante);
    return res.status(200).json({ message: 'Viajante deletado com sucesso' });
  }
}