import { ICustomError } from '@interfaces';
import { Request, Response } from 'express';

const errorHandlerMW = async (
    error: ICustomError,
    _: Request,
    res: Response
) => {
    return res.status(500).json({
        success: false,
        error
    });
};

export { errorHandlerMW };
