import { DB_URL } from '@config';
import { connect, disconnect, Mongoose, MongooseError } from 'mongoose';

const connectMongoDB = (): Promise<Mongoose> =>
    new Promise<Mongoose>(async (resolve, reject) => {
        try {
            const conn: Mongoose = await connect(DB_URL);

            return resolve(conn);
        } catch (error: unknown) {
            if (error instanceof MongooseError) {
                return reject(
                    `❌ ${
                        error.message ?? 'Failed to connect with MongoDB!'
                    } ❌`
                );
            }

            return reject(`❌ Failed to connect with MongoDB! ❌`);
        }
    });

const disconnectMongoDB = (): Promise<boolean> =>
    new Promise<boolean>(async (resolve, reject) => {
        try {
            await disconnect();

            return resolve(true);
        } catch (error: unknown) {
            if (error instanceof MongooseError) {
                return reject(
                    `❌ ${error.message ?? 'Failed to disconnect MongoDB!'} ❌`
                );
            }

            return reject(`❌ Failed to disconnect MongoDB! ❌`);
        }
    });

export { connectMongoDB, disconnectMongoDB };
