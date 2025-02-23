import { Model, Schema, model } from 'mongoose';
import { autoInjectable, container } from 'tsyringe';
import isEmail from 'validator/lib/isEmail';
import { IDBModel } from '@interfaces';
import { IAuthModel } from '../interfaces';

@autoInjectable()
class AuthModel implements IDBModel<IAuthModel> {
    schema: Schema<IAuthModel> = new Schema<IAuthModel>(
        {
            username: {
                type: String,
                required: [true, 'Username is required'],
                unique: [true, 'Username is already in use'],
                trim: true
            },
            email: {
                type: String,
                required: [true, 'Email is required'],
                unique: [true, 'Email is already in use'],
                trim: true,
                validate: [isEmail, 'Email format is invalid']
            },
            password: {
                type: String,
                required: [true, 'Password is required'],
                trim: true
            }
        },
        { timestamps: true }
    );

    model: Model<IAuthModel> = model<IAuthModel>('auths', this.schema);
}

// NOTE: We need to register models as singleton as models won't be used directly as instance variables in their respective services classes
container.registerSingleton<AuthModel>('AuthModel', AuthModel);

export default AuthModel;
