import 'reflect-metadata';
import express from 'express';
import { jest } from '@jest/globals';
import todosController from '..';
import { mockNext, mockRequest, mockResponse } from '../__mocks__';

jest.setTimeout(30000);
jest.createMockFromModule('../../services');

const addition = (a: number, b: number) => a + b;

export interface IPost {
    userId: number;
    id: number;
    title: string;
    body: string;
}

const fetchPosts = async (): Promise<IPost[]> => {
    const res = await fetch('https://jsonplaceholder.typicode.com/posts');

    const posts = await res.json();

    return posts;
};

describe('Check setup', () => {
    it('Should check controllers tests', () => {
        expect(1).toBe(1);
    });
});

describe('Addition function tests', () => {
    it('Should check the addition result of two numbers', () => {
        const sum = addition(1, 2);

        expect(sum).toBe(3);
        expect(sum).not.toBe(1);
        expect(sum).not.toBeLessThan(2);
    });
});

describe('JSON posts tests', () => {
    it('Should check the fetch posts function', async () => {
        const posts = await fetchPosts();

        expect(posts).toEqual(
            expect.arrayContaining([
                {
                    userId: 1,
                    id: 1,
                    title: 'sunt aut facere repellat provident occaecati excepturi optio reprehenderit',
                    body: 'quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto'
                }
            ])
        );
    });
});

describe('Fetch todos controller tests', () => {
    it('Should fetch all tasks', async () => {
        await todosController.fetchTodosAll(
            mockRequest,
            mockResponse,
            mockNext
        );

        expect(mockResponse.json).toHaveBeenCalled();
    });
});

describe('TodosController tests', () => {
    let req: Request;
    let res: Response;

    beforeEach(() => {
        req = jest.createMockFromModule('express');
        res = jest.createMockFromModule('express');
    });

    afterEach(() => {
        jest.resetAllMocks();
    });
});
