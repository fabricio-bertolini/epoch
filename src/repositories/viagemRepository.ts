import { AppDataSource } from "../data-source";
import { Viagem } from "../entities/Viagem";

export const viagemRepository = AppDataSource.getRepository(Viagem);