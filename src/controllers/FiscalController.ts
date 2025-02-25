import { Request, Response } from 'express';
import { fiscalRepository } from '../repositories/fiscalRespository';
import { BadRequestError, NotFoundError, UnauthorizedError } from '../helpers/api-errors';
import { VerificacaoCPF } from '../services/services';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export class FiscalController {
  async getFiscal(req: Request, res: Response) {
    const { fiscalId } = req.params;
    const fiscal = await fiscalRepository.findOneBy({ id: Number(fiscalId) });
    if (!fiscal) {
      throw new NotFoundError('Fiscal não encontrado');
    }
    return res.status(200).json(fiscal);
  }

  async getFiscalByCpf(req: Request, res: Response) {
    const { cpf } = req.params;
    const cpfValido = VerificacaoCPF.validarCPF(cpf);
    const fiscal = await fiscalRepository.findOneBy({ cpf: cpfValido });
    if (!fiscal) {
      throw new NotFoundError('Fiscal não encontrado');
    }
    return res.status(200).json(fiscal);
  }

  async listFiscal(req: Request, res: Response) {
    const fiscals = await fiscalRepository.find();
    return res.status(200).json(fiscals);
  }

  async createFiscal(req: Request, res: Response) {
    const { nome, usuario, senha, cpf } = req.body;
    if (!nome) {
        throw new BadRequestError('Nome não pode ser vazio.');
    }
    if (!usuario) {
        throw new BadRequestError('Usuário não pode ser vazio.');
    }
    if (!senha) {
        throw new BadRequestError('Senha não pode ser vazia.');
    }
    if (!cpf) {
        throw new BadRequestError('CPF não pode ser vazio.');
    }

    const cpfValido = VerificacaoCPF.validarCPF(cpf);
    const existingFiscal = await fiscalRepository.findOneBy({ cpf: cpfValido });
    const existingFiscalUsuario = await fiscalRepository.findOneBy({ usuario });

    if (existingFiscalUsuario) {
      throw new BadRequestError('Já existe um fiscal com este usuário');
    }
    if (existingFiscal) {
      throw new BadRequestError('Já existe um fiscal com este CPF');
    }

    const hashedPassword = await bcrypt.hash(senha, 10);
    const fiscal = fiscalRepository.create({
      nome,
      usuario,
      senha: hashedPassword,
      cpf: cpfValido
    });

    await fiscalRepository.save(fiscal);
    const { senha: _, ...fiscalSemSenha } = fiscal;
    return res.status(201).json(fiscalSemSenha);
  }

  async updateFiscal(req: Request, res: Response) {
    const { fiscalId } = req.params;
    const { nome, senha, usuario, cpf } = req.body;
    const fiscal = await fiscalRepository.findOneBy({ id: Number(fiscalId) });
    if (!fiscal) {
        throw new NotFoundError('Fiscal não encontrado');
    }

    if (nome) {
        if ( nome == fiscal.nome) throw new BadRequestError('Mesmo valor de Nome já cadastrada no mesmo fiscal');
        fiscal.nome = nome;
    }

    if (cpf) {
        const cpfValido = VerificacaoCPF.validarCPF(cpf);
        const existingFiscalcpf = await fiscalRepository.findOneBy({ cpf: cpfValido });

        if (existingFiscalcpf) {
            throw new BadRequestError('Já existe um fiscal com este CPF');
        }

        if (cpfValido) {
            if ( cpfValido == fiscal.cpf) throw new BadRequestError('Mesmo valor de CPF já cadastrada no mesmo fiscal');
            fiscal.cpf = cpfValido;
        }
    }
  
    if (usuario) {
        const existingFiscalUsuario = await fiscalRepository.findOneBy({ usuario });

        if (existingFiscalUsuario) {
          throw new BadRequestError('Já existe um fiscal com este usuário');
        }
        
        if (usuario) {
            if ( usuario == fiscal.usuario) throw new BadRequestError('Mesmo valor de Usuario já cadastrada no mesmo fiscal');   
            fiscal.usuario = usuario;
        }
    }
 
    if (senha) {
        const hashedPassword = await bcrypt.hash(senha, 10);

        if (hashedPassword) {
            if ( hashedPassword == fiscal.senha) throw new BadRequestError('Mesmo valor de Senha já cadastrada no mesmo fiscal');
            fiscal.senha = hashedPassword;
        }
    }

    await fiscalRepository.save(fiscal);
    const { senha: _, ...fiscalSemSenha } = fiscal;
    return res.status(201).json(fiscalSemSenha);
  }

  async deleteFiscal(req: Request, res: Response) {
    const { fiscalId } = req.params;
    const fiscal = await fiscalRepository.findOneBy({ id: Number(fiscalId) });
    if (!fiscal) {
      throw new NotFoundError('Fiscal não encontrado');
    }
    await fiscalRepository.remove(fiscal);
    return res.status(200).json({ message: 'Fiscal deletado com sucesso' });
  }

  async login(req: Request, res: Response) {
    const { usuario, senha } = req.body;
    const fiscal = await fiscalRepository.findOneBy({ usuario });

    if (!fiscal) {
      throw new BadRequestError('Usuario ou senha inválido.');
    }

    const validPassword = await bcrypt.compare(senha, fiscal.senha);
    if (!validPassword) {
      throw new BadRequestError('Usuário ou senha inválidos');
    }

    const token = jwt.sign({ id: fiscal.id }, process.env.JWT_SECRET ?? '', { 
        expiresIn: '30m' 
    });

    const { senha: _, ...fiscalSemSenha } = fiscal;
    
    return res.json({
        fiscal: fiscalSemSenha,
        token: token
    });
  }

  async getProfile(req: Request, res: Response) {
    return res.json(req.usuario);
    }
}