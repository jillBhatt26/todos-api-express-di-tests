import { Router } from 'express';
import { TodosRouter } from '@modules/Todo';

const appRouter: Router = Router();

appRouter.use('/todos', TodosRouter);

export default appRouter;
