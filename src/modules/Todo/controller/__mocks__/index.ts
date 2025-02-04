import { Request, Response, NextFunction } from 'express-serve-static-core';

const mockRequest = {} as unknown as Request;

const mockResponse = {
    json: jest.fn(),
    status: jest.fn()
} as unknown as Response;

const mockNext = {} as unknown as NextFunction;

export { mockRequest, mockResponse, mockNext };
