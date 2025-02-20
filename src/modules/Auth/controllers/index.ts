import { NextFunction, Request, Response } from 'express';
import { autoInjectable, container, inject, singleton } from 'tsyringe';
import { ICustomError } from '@interfaces';
import AuthServices from '../services';
import PasswordUtils from '../utils/Password';
import { IAuthInfo } from '../interfaces';

@autoInjectable()
@singleton()
class AuthControllers {
    // NOTE: authService is an instance variable and the below constructor will act as a primary constructor
    constructor(
        @inject(AuthServices) private readonly authService: AuthServices,
        @inject(PasswordUtils) private readonly passwordUtils: PasswordUtils
    ) {}

    public fetchActiveUser = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            if (!req.session || !req.session.userID || !req.session.username) {
                return next({
                    code: 400,
                    message: 'Authentication required to fetch user!'
                } as ICustomError);
            }

            const user = await this.authService.findOne(
                {
                    $and: [
                        { username: req.session.username },
                        { _id: req.session.userID }
                    ]
                },
                { password: 0 }
            );

            if (!user || !user.id || !user.username || !user.email)
                return next({
                    code: 404,
                    message: 'User not found!'
                } as ICustomError);

            const foundUser: IAuthInfo = {
                id: user.id,
                username: user.username,
                email: user.email
            };

            return res
                .status(200)
                .json({ success: true, data: { user: foundUser } });
        } catch (error: unknown) {
            return next({
                code: 500,
                message: 'Fetch active user failed!'
            } as ICustomError);
        }
    };

    public signup = async (req: Request, res: Response, next: NextFunction) => {
        if (req.session && (req.session.userID || req.session.username)) {
            return next({
                code: 400,
                message: 'You are already logged in!'
            } as ICustomError);
        }

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

        try {
            // validate  username and email availability
            const checkUserExists = await this.authService.findOne(
                {
                    $or: [{ username }, { email }]
                },
                { password: 0 }
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

            const newUser = await this.authService.create(
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

            const signedUpUser: IAuthInfo = {
                id: newUser.id,
                username: newUser.username,
                email: newUser.email
            };

            // start session
            // req.session.userID = newUser.id;
            // req.session.username = newUser.username;

            return res.status(201).json({
                success: true,
                data: {
                    newUser: signedUpUser
                }
            });
        } catch (error: unknown) {
            return next({
                code: 500,
                message: 'User signup failed!'
            } as ICustomError);
        }
    };

    public login = async (req: Request, res: Response, next: NextFunction) => {
        if (req.session && (req.session.userID || req.session.username)) {
            return next({
                code: 400,
                message: 'You are already authenticated!'
            } as ICustomError);
        }

        // validate inputs
        let { username, email, password } = req.body;

        if (!username && !email) {
            const error: ICustomError = {
                code: 400,
                message: 'Either username or email required!'
            };

            return next(error);
        }

        if (!password) {
            const error: ICustomError = {
                code: 400,
                message: 'Please required!'
            };

            return next(error);
        }

        if (username) username = username.trim();
        if (email) email = email.trim();
        password = password.trim();

        if ((username && !username.length) || (email && !email.length)) {
            const error: ICustomError = {
                code: 400,
                message: 'Username or email required without whitespaces!'
            };

            return next(error);
        }

        if (!password.length) {
            const error: ICustomError = {
                code: 400,
                message: 'Password required without whitespaces!'
            };

            return next(error);
        }

        try {
            // validate  username and email availability
            const existingUser = await this.authService.findOne({
                $or: [{ username }, { email }]
            });

            if (!existingUser) {
                const error: ICustomError = {
                    code: 404,
                    message: 'User not found! Please sign up first!'
                };

                return next(error);
            }

            // check if password is correct
            const isPasswordCorrect = await this.passwordUtils.verify(
                existingUser.password,
                password
            );

            if (!isPasswordCorrect) {
                return next({
                    code: 400,
                    message: 'Incorrect password!'
                } as ICustomError);
            }

            // start session
            req.session.userID = existingUser.id;
            req.session.username = existingUser.username;

            const loggedInUser: IAuthInfo = {
                id: existingUser.id,
                username: existingUser.username,
                email: existingUser.email
            };

            return res.status(200).json({
                success: true,
                data: {
                    user: loggedInUser
                }
            });
        } catch (error: unknown) {
            return next({
                code: 500,
                message: 'User log in failed!'
            } as ICustomError);
        }
    };

    public logout = async (req: Request, res: Response, next: NextFunction) => {
        if (!req.session || !req.session.userID || !req.session.username) {
            return next({
                code: 500,
                message: 'Authentication required to logout user!'
            } as ICustomError);
        }

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
        if (!req.session || !req.session.userID || !req.session.username) {
            return next({
                code: 500,
                message: 'Authentication required to update user!'
            } as ICustomError);
        }

        // validate inputs
        let { username, email, password } = req.body;

        if (username) username = username.trim();
        if (email) email = email.trim();
        if (password) password = password.trim();

        if (
            (username && !username.length) ||
            (email && !email.length) ||
            (password && !password.length)
        ) {
            const error: ICustomError = {
                code: 400,
                message: 'Empty user details provided!'
            };

            return next(error);
        }

        try {
            // validate  username and email availability
            const checkUserExists = await this.authService.findById(
                req.session.userID
            );

            if (!checkUserExists) {
                const error: ICustomError = {
                    code: 400,
                    message:
                        'User not found! Please try with different email or username!'
                };

                return next(error);
            }

            const toUpdateValues = {
                ...checkUserExists,
                username,
                email
            };

            // create user in db
            if (password) {
                const hashedPassword = await this.passwordUtils.hash(password);

                toUpdateValues.password = hashedPassword;
            }

            const updatedUser = await this.authService.findByIdAndUpdate(
                req.session.userID,
                toUpdateValues
            );

            if (!updatedUser || !updatedUser.id || !updatedUser.username) {
                return next({
                    code: 400,
                    message: 'Failed to update user!'
                } as ICustomError);
            }

            // start session
            req.session.userID = updatedUser.id;
            req.session.username = updatedUser.username;

            return res.status(201).json({
                success: true,
                data: {
                    newUser: updatedUser
                }
            });
        } catch (error: unknown) {
            return next({
                code: 500,
                message: 'User update failed!'
            } as ICustomError);
        }
    };

    public deleteUser = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        if (!req.session || !req.session.userID || !req.session.username) {
            return next({
                code: 500,
                message: 'Authentication required to update user!'
            } as ICustomError);
        }

        try {
            // validate  username and email availability
            const checkUserExists = await this.authService.findById(
                req.session.userID
            );

            if (!checkUserExists) {
                const error: ICustomError = {
                    code: 400,
                    message: 'User not found!'
                };

                return next(error);
            }

            const deletedUser = await this.authService.findByIdAndDelete(
                req.session.userID
            );

            if (!deletedUser || !deletedUser.id || !deletedUser.username) {
                return next({
                    code: 400,
                    message: 'Failed to delete user!'
                } as ICustomError);
            }

            // end session
            req.session.destroy(error => {
                if (error)
                    return next({
                        code: 500,
                        message: 'Error occurred while terminating session!'
                    } as ICustomError);

                return res.status(200).json({ success: true });
            });
        } catch (error: unknown) {
            return next({
                code: 500,
                message: 'User delete failed!'
            } as ICustomError);
        }
    };
}

const authControllers = container.resolve(AuthControllers);

export default authControllers;
