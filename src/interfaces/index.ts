import { Model, Schema } from 'mongoose';

export interface ICustomError {
    code: number;
    message: string;
}

export interface IDBModel<T> {
    schema: Schema<T>;
    model: Model<T>;
}
