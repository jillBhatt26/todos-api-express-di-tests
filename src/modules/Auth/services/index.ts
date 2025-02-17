import { autoInjectable, inject, singleton } from 'tsyringe';
import DBServices from '@db/services';
import { IAuthModel } from '../interfaces';
import AuthModel from '../model';

@autoInjectable()
@singleton()
class AuthServices extends DBServices<IAuthModel> {
    // NOTE: DBModel isn't an instance variable and the constructor will not act as a primary constructor
    constructor(@inject('AuthModel') DBModel: AuthModel) {
        super(DBModel);
    }
}

export default AuthServices;
