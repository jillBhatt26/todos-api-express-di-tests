import cors from 'cors';
import express, { Application } from 'express';
import { FE_URL, PORT } from '@config';
import { connectMongoDB } from '@db';
import appRouter from '@router';

connectMongoDB()
    .then(conn => {
        const app: Application = express();

        app.use(
            cors({
                origin: [FE_URL],
                methods: ['GET', 'POST', 'PUT', 'DELETE'],
                allowedHeaders: ['Content-Type']
            })
        );

        app.use('/api', appRouter);

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
