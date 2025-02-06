import 'reflect-metadata';
import { container } from 'tsyringe';
import { jest } from '@jest/globals';
import { ITodo } from '@modules/Todo/interfaces';
import { ETodoStatus } from '@modules/Todo/enums';
import TodosServices from '..';

describe('TodosServices', () => {
    let todosServices: jest.Mocked<TodosServices>;

    beforeAll(() => {
        todosServices = container.resolve(
            TodosServices
        ) as jest.Mocked<TodosServices>;

        todosServices.find = jest.fn();
    });

    describe('Fetch todos all', () => {
        it('Should return all todos', async () => {
            const todos: ITodo[] = [
                {
                    _id: '1',
                    name: 'Name 2',
                    description: 'Description 1',
                    status: ETodoStatus.PENDING
                } as ITodo,
                {
                    _id: '2',
                    name: 'Name 2',
                    description: 'Description 2',
                    status: ETodoStatus.PENDING
                } as ITodo
            ];

            todosServices.find.mockResolvedValue(todos);

            const allTodos = await todosServices.find();

            expect(todosServices.find).toHaveBeenCalledTimes(1);
            expect(allTodos).toEqual(todos);
        });
    });

    afterEach(() => {
        jest.resetAllMocks();
    });
});
