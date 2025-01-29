import { Document } from 'mongoose';
import { ETodoStatus } from '../enums';

export interface ITodo extends Document {
    name: string;
    description: string;
    status: ETodoStatus;
}

export interface ICreateTodoData {
    name: string;
    description: string;
    status?: ETodoStatus;
}

export interface IUpdateTodoData {
    name?: string;
    description?: string;
    status?: ETodoStatus;
}
