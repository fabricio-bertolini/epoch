import { AppDataSource } from "../data-source";
import { Fiscal } from "../entities/Fiscal";

export const fiscalRepository = AppDataSource.getRepository(Fiscal);