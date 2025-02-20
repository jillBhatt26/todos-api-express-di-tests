import { Model, Schema, model } from 'mongoose';
import { autoInjectable, container } from 'tsyringe';
import { IDBModel } from '@interfaces';
import { ETodoStatus } from '../enums';
import { ITodo } from '../interfaces';

@autoInjectable()
class TodosModel implements IDBModel<ITodo> {
    schema: Schema<ITodo> = new Schema<ITodo>(
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

    model: Model<ITodo> = model<ITodo>('todos', this.schema);
}

container.registerSingleton<TodosModel>('TodosModel', TodosModel);

export default TodosModel;
