import { Router } from 'express';
import { TodoRouter } from '@modules/Todo';

const appRouter: Router = Router();

appRouter.use('/todos', TodoRouter);

export default appRouter;
