import { autoInjectable, inject, singleton } from 'tsyringe';
import DBServices from '@db/services';
import { IAuthModel } from '../interfaces';
import AuthModel from '../model';

@autoInjectable()
@singleton()
class AuthServices extends DBServices<IAuthModel> {
    constructor(@inject('AuthModel') DBModel: AuthModel) {
        super(DBModel);
    }
}

export default AuthServices;
