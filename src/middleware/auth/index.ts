import { ICustomError } from '@interfaces';
import AuthServices from '@modules/Auth/services';
import { NextFunction, Request, Response } from 'express';
import { autoInjectable, container, singleton } from 'tsyringe';

@autoInjectable()
@singleton()
class AuthMiddleware {
    constructor(private authServices: AuthServices) {}

    strict = async (req: Request, _: Response, next: NextFunction) => {
        try {
            if (req.session && req.session.userID && req.session.username) {
                const { userID } = req.session;

                const authUser = await this.authServices.findById(userID);

                if (authUser) return next();
            }

            const authRequiredError: ICustomError = {
                code: 401,
                message: 'You will have to log in first!'
            };

            return next(authRequiredError);
        } catch (error: unknown) {
            const strictAuthError: ICustomError = {
                code: 500,
                message: 'Failed to authorize user!'
            };

            return next(strictAuthError);
        }
    };
}

const authMiddleware = container.resolve(AuthMiddleware);

export default authMiddleware;
