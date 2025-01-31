import os from 'os';
import express, { Application, Response } from 'express';
import cors from 'cors';
import { FE_URL } from '@config';
import { errorHandlerMW } from '@middleware/error';
import appRouter from '@router';

const initExpressApp = (): Application => {
    const app: Application = express();

    // app middleware
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.use(
        cors({
            origin: [FE_URL],
            methods: ['GET', 'POST', 'PUT', 'DELETE'],
            allowedHeaders: ['Content-Type']
        })
    );

    // custom middleware and router
    app.use('/info', (_, res: Response) => {
        return res.status(200).json({
            success: true,
            host: os.hostname()
        });
    });
    app.use('/api', appRouter);
    app.use(errorHandlerMW);

    return app;
};

export default initExpressApp;
