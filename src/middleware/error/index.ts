import { ICustomError } from '@interfaces';
import { NextFunction, Request, Response } from 'express';

const errorHandlerMW = async (
    error: ICustomError,
    _: Request,
    res: Response,
    __: NextFunction
) => {
    return res.status(error.code).json({
        success: false,
        error
    });
};

export { errorHandlerMW };
