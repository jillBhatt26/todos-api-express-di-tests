import 'reflect-metadata';
import initExpressApp from '@app';
import { PORT } from '@config';
import connection from '@db/connection';

connection
    .connectMongoDB()
    .then(conn => {
        const app = initExpressApp();

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
