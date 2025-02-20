import express, { Application } from 'express';
import cors from 'cors';
import MongoStore from 'connect-mongo';
import session from 'express-session';
import swaggerUi from 'swagger-ui-express';
import { DB_URL, FE_URL, SESSION_SECRET } from '@config/env';
import swaggerSpecs from '@config/swagger';
import { errorHandlerMW } from '@middleware/error';
import appRouter from '@router';
import initAppSession from '@config/session';

const initExpressApp = (): Application => {
    const app: Application = express();

    // app middleware
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // cors
    app.use(
        cors({
            origin: [FE_URL],
            methods: ['GET', 'POST', 'PUT', 'DELETE'],
            allowedHeaders: ['Content-Type'],
            credentials: true
        })
    );

    // session
    // const mongoStore = MongoStore.create({
    //     mongoUrl: DB_URL,
    //     collectionName: 'sessions'
    // });

    // app.use(
    //     // @ts-ignore
    //     session({
    //         secret: SESSION_SECRET,
    //         resave: true,
    //         saveUninitialized: false,
    //         store: mongoStore
    //     })
    // );

    app.use(
        // @ts-ignore
        initAppSession()
    );

    app.use('/api', appRouter);
    app.use(errorHandlerMW);

    // swagger
    app.use(
        '/',
        // NOTE: Adding ts-ignore to resolve typing incompatibility between swagger and express as on 14/02/2025
        // @ts-ignore
        swaggerUi.serve,
        swaggerUi.setup(swaggerSpecs, {
            customSiteTitle: 'Todos API',
            customfavIcon: undefined
        })
    );

    return app;
};

export default initExpressApp;
