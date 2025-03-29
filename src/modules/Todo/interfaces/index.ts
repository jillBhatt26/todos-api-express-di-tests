import mongoose, { Document } from 'mongoose';
import { ETodoStatus } from '../enums';

export interface ITodo extends Document {
    name: string;
    description: string;
    status: ETodoStatus;
    userID: mongoose.Types.ObjectId;
}

export interface ICreateTodoData {
    name: string;
    description: string;
    userID: mongoose.Types.ObjectId;
    status?: ETodoStatus;
}

export interface IUpdateTodoData {
    name?: string;
    description?: string;
    userID: mongoose.Types.ObjectId;
    status?: ETodoStatus;
}
