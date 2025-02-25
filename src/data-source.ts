import 'reflect-metadata'
import 'dotenv/config'
import { DataSource } from 'typeorm';
import { Viajante } from './entities/Viajante';
import { Infracao } from './entities/Infracao';
import { Viagem } from './entities/Viagem';
import { Fiscal } from './entities/Fiscal';

const port = process.env.DB_PORT as number | undefined;

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: port,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: [Viajante, Infracao, Viagem, Fiscal],
  migrations: [`${__dirname}/**/migrations/*{.ts,.js}`],
  //synchronize: true
});

//export default config;
