import type { Request } from 'express';
import { Model, Schema } from 'mongoose';

export interface ICustomRequest extends Request {}

export interface ICustomError {
    code: number;
    message: string;
}

export interface IDBModel<T> {
    schema: Schema<T>;
    model: Model<T>;
}
