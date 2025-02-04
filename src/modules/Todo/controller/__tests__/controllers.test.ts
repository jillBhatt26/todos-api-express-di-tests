import 'reflect-metadata';
import todosController from '..';
import { mockNext, mockRequest, mockResponse } from '../__mocks__';

describe('Check setup', () => {
    it('Should check controllers tests', () => {
        expect(1).toBe(1);
    });
});

describe('Create controller tests', () => {
    it('Should fetch all tasks', async () => {
        await todosController.fetchTodosAll(
            mockRequest,
            mockResponse,
            mockNext
        );
    });

    expect(mockResponse.json).toHaveBeenCalled();
});
