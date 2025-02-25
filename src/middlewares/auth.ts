import { UnauthorizedError } from '../helpers/api-errors';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { fiscalRepository } from '../repositories/fiscalRespository';

type JwtPayload = {
    id: number;
};

export const authMiddleware = async (
    req: Request, 
    res: Response, 
    next: NextFunction
) => {
    const { authorization } = req.headers;
    if (!authorization) {
        throw new UnauthorizedError('Token não fornecido');
    }
    try{
        const token = authorization.replace('Bearer ', '');
        const { id } = jwt.verify(token, process.env.JWT_SECRET ?? '') as JwtPayload;
        const fiscal = await fiscalRepository.findOneBy({ id });
        if (!fiscal) {
            throw new UnauthorizedError('Não autorizado');
        }
        const { senha: _, ...usuarioLogado } = fiscal;
        req.usuario = usuarioLogado;
        next();
    }
    catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            throw new UnauthorizedError('Token expirado');
        }
        throw error;
    }
}