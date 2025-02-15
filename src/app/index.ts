import express, { Application } from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { FE_URL } from '@config/env';
import swaggerSpecs from '@config/swagger';
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

    // swagger
    app.use(
        '/docs',
        // NOTE: Adding ts-ignore to resolve typing incompatibility between swagger and express as on 14/02/2025
        // @ts-ignore
        swaggerUi.serve,
        swaggerUi.setup(swaggerSpecs, {
            customSiteTitle: 'Todos API',
            customfavIcon: undefined
        })
    );

    app.use('/api', appRouter);
    app.use(errorHandlerMW);

    return app;
};

export default initExpressApp;
