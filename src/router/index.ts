import os from 'os';
import { Router, Response } from 'express';
import { TodosRouter } from '@modules/Todo';
import { AuthRouter } from '@modules/Auth';

const appRouter: Router = Router();

// custom middleware and router
appRouter.use('/info', (_, res: Response) => {
    return res.status(200).json({
        success: true,
        host: os.hostname()
    });
});

appRouter.use('/todos', TodosRouter);
appRouter.use('/auth', AuthRouter);

export default appRouter;
