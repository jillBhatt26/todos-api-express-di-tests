import { Document } from 'mongoose';
import { ETodoStatus } from '../enums';

export interface ITodo extends Document {
    name: string;
    description: string;
    status: ETodoStatus;
}
