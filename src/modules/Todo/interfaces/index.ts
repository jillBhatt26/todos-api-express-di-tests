import { Document, ObjectId } from 'mongoose';
import { ETodoStatus } from '../enums';

export interface ITodo extends Document {
    name: string;
    description: string;
    status: ETodoStatus;
    userID: ObjectId;
}

export interface ICreateTodoData {
    name: string;
    description: string;
    userID: ObjectId;
    status?: ETodoStatus;
}

export interface IUpdateTodoData {
    name?: string;
    description?: string;
    userID: ObjectId;
    status?: ETodoStatus;
}
