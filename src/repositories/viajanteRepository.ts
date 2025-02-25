import { AppDataSource } from "../data-source";
import { Viajante } from "../entities/Viajante";

export const viajanteRepository = AppDataSource.getRepository(Viajante);