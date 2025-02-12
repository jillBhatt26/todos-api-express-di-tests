import express, { Application, Response, RequestHandler } from 'express';
import cors from 'cors';
import { FE_URL } from '@config/env';
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

    app.use('/api', appRouter);
    app.use(errorHandlerMW);

    return app;
};

export default initExpressApp;
