import { autoInjectable, singleton } from 'tsyringe';
import DBServices from '@db/services';
import { IAuthModel } from '../interfaces';
import AuthModel from '../model';

@autoInjectable()
@singleton()
class AuthServices extends DBServices<IAuthModel> {
    constructor(DBModel: AuthModel) {
        super(DBModel);
    }
}

export default AuthServices;
