import 'express-async-errors';
import 'reflect-metadata';
import express from 'express';
import Logger from './middlewares/logger';
import { AppDataSource } from './data-source';
import routes from './routes';
import { errorMiddleware } from './middlewares/error';
import morganMiddleware from './middlewares/morgan';

// Criar conexão com o banco de dados e iniciar o servidor
AppDataSource.initialize().then(() => {
  const app = express();
  app.use(express.json());

  // Middleware de logger usando morgan
  app.use(morganMiddleware);

  // Configurar rotas
  app.use(routes);

  // Middleware de tratamento de erro
  app.use(errorMiddleware);

  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    Logger.debug(`Server está sendo executado em: @ http://localhost:${port}`);
  });
}).catch((error) => {
  Logger.error('Erro ao inicializar a conexão com o banco de dados:', error);
});