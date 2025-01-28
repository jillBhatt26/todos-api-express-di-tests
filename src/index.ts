import os from 'os';
import cors from 'cors';
import express, { Application, Response } from 'express';
import { FE_URL, PORT } from '@config';
import { connectMongoDB } from '@db';
import appRouter from '@router';
import { errorHandlerMW } from '@middleware/error';

connectMongoDB()
    .then(conn => {
        const app: Application = express();

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

        app.listen(PORT, () => {
            console.log(
                `✅✅...MongoDB connected on: ${conn.connection.host}...✅✅`
            );
            console.log(
                `🚀🚀🚀...API server exposed on port: ${PORT}...🚀🚀🚀`
            );
        });
    })
    .catch(error => {
        console.log(`❌❌...Server startup error: ${error.message}...❌❌`);

        process.exit(1);
    });
