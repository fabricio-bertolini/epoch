import { Router } from 'express';
import { ViajanteController } from './controllers/ViajanteController';
import { InfracaoController } from './controllers/InfracaoController';
import { ViagemController } from './controllers/ViagemController';
import { FiscalController } from './controllers/FiscalController';
import Logger from './middlewares/logger';
import { authMiddleware } from './middlewares/auth';

const routes = Router();

routes.get("/logger", (_, res) => {
    Logger.error("This is an error log");
    Logger.warn("This is a warn log");
    Logger.info("This is a info log");
    Logger.http("This is a http log");
    Logger.debug("This is a debug log");
  
    res.send("Hello world");
});

//Login
routes.post('/fiscal', new FiscalController().createFiscal);
routes.post('/login', new FiscalController().login);

routes.use(authMiddleware);

//Fiscal
routes.get('/fiscal', new FiscalController().listFiscal);
routes.get('/fiscal/:fiscalId', new FiscalController().getFiscal);
routes.get('/fiscal/:cpf', new FiscalController().getFiscalByCpf);
routes.put('/fiscal/:fiscalId', new FiscalController().updateFiscal);
routes.delete('/fiscal/:fiscalId', new FiscalController().deleteFiscal);
routes.get('/profile', new FiscalController().getProfile);

//Viajante
routes.get('/viajante', new ViajanteController().listViajante);
routes.get('/viajante/:viajanteId', new ViajanteController().getViajante);
routes.get('/viajante/:numeroPassaporte', new ViajanteController().getViajanteByNumeroDePassaporte);
routes.post('/viajante', new ViajanteController().createViajante);
routes.put('/viajante/:viajanteId', new ViajanteController().updateViajante);
routes.delete('/viajante/:viajanteId', new ViajanteController().deleteViajante);

//Infracao
routes.get('/viajante/:viajanteId/infracao', new InfracaoController().listInfracao);
routes.get('/viajante/:viajanteId/infracao/:infracaoId', new InfracaoController().getInfracao);
routes.post('/viajante/:viajanteId/:viagemId/:fiscalId/infracao/', new InfracaoController().createInfracao);
routes.put('/viajante/:viajanteId/infracao/:infracaoId', new InfracaoController().updateInfracao);
routes.delete('/viajante/:viajanteId/infracao/:infracaoId', new InfracaoController().deleteInfracao);

//Viagem
routes.get('/viajante/:viajanteId/viagem', new ViagemController().listViagem);
routes.get('/viajante/:viajanteId/viagem/:viagemId', new ViagemController().getViagem);
routes.post('/viajante/:viajanteId/viagem', new ViagemController().createViagem);
routes.put('/viajante/:viajanteId/viagem/:viagemId', new ViagemController().updateViagem);
routes.delete('/viajante/:viajanteId/viagem/:viagemId', new ViagemController().deleteViagem);

export default routes;