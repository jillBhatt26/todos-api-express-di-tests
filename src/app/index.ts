import os from 'os';
import express, { Application, Response, RequestHandler } from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { FE_URL } from '@config/env';
import swaggerJsDocSpecs from '@config/swagger';
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

    // NOTE: Some issues present with swagger type compatibility as on (12/02/2025)
    // @ts-ignore
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerJsDocSpecs));

    return app;
};

export default initExpressApp;
