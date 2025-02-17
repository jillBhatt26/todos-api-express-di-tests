import { NextFunction, Request, Response } from 'express';
import { autoInjectable, container, singleton } from 'tsyringe';
import AuthServices from '../services';
import { ICustomError } from '@interfaces';
import PasswordUtils from '../utils/Password';

@autoInjectable()
@singleton()
class AuthControllers {
    constructor(
        private authServices: AuthServices,
        private passwordUtils: PasswordUtils
    ) {}

    public fetchActiveUser = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        // find and return user
    };

    public signup = async (req: Request, res: Response, next: NextFunction) => {
        // validate inputs
        let { username, email, password } = req.body;

        if (!username || !email || !password) {
            const error: ICustomError = {
                code: 400,
                message: 'Please provide all user details!'
            };

            return next(error);
        }

        username = username.trim();
        email = email.trim();
        password = password.trim();

        if (!username.length || !email.length || !password.length) {
            const error: ICustomError = {
                code: 400,
                message: 'Empty user details provided!'
            };

            return next(error);
        }

        // validate  username and email availability
        const checkUserExists = await this.authServices.findOne(
            {
                $or: [{ username }, { email }]
            },
            { username: 1, email: 1 }
        );

        if (checkUserExists) {
            const error: ICustomError = {
                code: 400,
                message:
                    'User already exists.Please try with different email or username!'
            };

            return next(error);
        }

        // create user in db
        const hashedPassword = await this.passwordUtils.hash(password);

        const newUser = await this.authServices.create(
            {
                username,
                email,
                password: hashedPassword
            },
            { password: 0 }
        );

        if (!newUser || !newUser.id || !newUser.username) {
            return next({
                code: 400,
                message: 'Failed to create new user!'
            } as ICustomError);
        }

        // start session
        req.session.userID = newUser.id;
        req.session.username = newUser.username;

        return res.status(201).json({
            success: true,
            data: {
                newUser
            }
        });
    };

    public login = async (req: Request, res: Response, next: NextFunction) => {
        // validate inputs
        // see if user exists
        // verify password
        // start session
    };

    public logout = async (req: Request, res: Response, next: NextFunction) => {
        // end session
        req.session.destroy(error => {
            if (error)
                return next({
                    code: 500,
                    message: 'Error occurred while logging out!'
                } as ICustomError);

            return res.status(200).json({ success: true });
        });
    };

    public updateUser = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        // see if user exists
        // verify inputs
        // verify username and email availability
        // update the record
        // end session
        // init new session
    };

    public deleteUser = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        // see if user exists
        // end session
        // delete the user from db
    };
}

const authControllers = container.resolve(AuthControllers);

export default authControllers;
