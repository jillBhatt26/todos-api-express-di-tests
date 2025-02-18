import { NextFunction, Request, Response } from 'express';
import { autoInjectable, container, inject, singleton } from 'tsyringe';
import { ICustomError } from '@interfaces';
import AuthServices from '@modules/Auth/services';

@autoInjectable()
@singleton()
class AuthMiddleware {
    constructor(
        @inject(AuthServices) private readonly authServices: AuthServices
    ) {}

    strict = async (req: Request, _: Response, next: NextFunction) => {
        try {
            if (req.session && req.session.userID && req.session.username) {
                try {
                    const { userID } = req.session;

                    const authUser = await this.authServices.findById(userID, {
                        password: 0
                    });

                    if (authUser) return next();
                } catch (error: unknown) {
                    if (error instanceof Error) {
                        return next({
                            code: 500,
                            message: 'Authentication failed!'
                        } as ICustomError);
                    }
                }
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
