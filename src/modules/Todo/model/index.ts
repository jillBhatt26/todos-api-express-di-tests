import { Model, Schema, model } from 'mongoose';
import { container, injectable, singleton } from 'tsyringe';
import { IDBModel } from '@interfaces';
import { ETodoStatus } from '../enums';
import { ITodo } from '../interfaces';

@singleton()
@injectable()
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

container.register<IDBModel<ITodo>>(TodosModel, { useClass: TodosModel });

export default TodosModel;
