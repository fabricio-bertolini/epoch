import { AppDataSource } from "../data-source";
import { Infracao } from "../entities/Infracao";

export const infracaoRepository = AppDataSource.getRepository(Infracao);