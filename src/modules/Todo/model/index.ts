import { Schema, model } from 'mongoose';
import { ETodoStatus } from '../enums';
import { ITodo } from '../interfaces';

const TodoSchema = new Schema<ITodo>(
    {
        name: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        status: {
            type: String,
            enum: ETodoStatus,
            required: true,
            default: ETodoStatus.PENDING
        }
    },
    { timestamps: true }
);

const Todos = model<ITodo>('todo', TodoSchema);

export default Todos;
