import {
    connect,
    ConnectOptions,
    disconnect,
    Mongoose,
    MongooseError
} from 'mongoose';
import { autoInjectable, container, singleton } from 'tsyringe';
import { DB_URL } from '@config/env';

@singleton()
@autoInjectable()
class Connection {
    private conn: Mongoose | undefined;

    public connectMongoDB = (url?: string): Promise<Mongoose> =>
        new Promise<Mongoose>(async (resolve, reject) => {
            try {
                const mongooseConnectionOptions: ConnectOptions = {
                    serverSelectionTimeoutMS: 600000 // 10 mins
                };

                const conn: Mongoose = await connect(
                    url ?? DB_URL,
                    mongooseConnectionOptions
                );

                this.conn = conn;

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

    public disconnectMongoDB = (): Promise<boolean> =>
        new Promise<boolean>(async (resolve, reject) => {
            try {
                await disconnect();

                return resolve(true);
            } catch (error: unknown) {
                if (error instanceof MongooseError) {
                    return reject(
                        `❌ ${
                            error.message ?? 'Failed to disconnect MongoDB!'
                        } ❌`
                    );
                }

                return reject(`❌ Failed to disconnect MongoDB! ❌`);
            }
        });

    public getConn = () => this.conn && this.conn;
}

const connection = container.resolve(Connection);

export default connection;
