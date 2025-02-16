import { Model, Schema, model } from 'mongoose';
import { autoInjectable, singleton } from 'tsyringe';
import { IDBModel } from '@interfaces';
import { IAuthModel } from '../interfaces';

@autoInjectable()
@singleton()
class AuthModel implements IDBModel<IAuthModel> {
    schema: Schema<IAuthModel> = new Schema<IAuthModel>(
        {
            username: {
                type: String,
                required: true
            },
            email: {
                type: String,
                required: true
            },
            password: {
                type: String,
                required: true
            }
        },
        { timestamps: true }
    );

    model: Model<IAuthModel> = model<IAuthModel>('auths', this.schema);
}

export default AuthModel;
