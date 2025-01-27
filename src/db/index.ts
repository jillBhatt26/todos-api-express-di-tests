import { DB_URL } from '@config';
import { connect, Mongoose, MongooseError } from 'mongoose';

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

export { connectMongoDB };
