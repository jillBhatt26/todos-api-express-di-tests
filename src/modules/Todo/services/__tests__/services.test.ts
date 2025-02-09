import 'reflect-metadata';
import { Mongoose } from 'mongoose';
import { container } from 'tsyringe';
import { jest } from '@jest/globals';
import { TEST_DB_URL } from '@config';
import { JEST_TIMEOUT } from '@constants';
import connection from '@db/connection';
import { ITodo } from '@modules/Todo/interfaces';
import { ETodoStatus } from '@modules/Todo/enums';
import TodosServices from '..';

jest.setTimeout(JEST_TIMEOUT);

// describe('TodosServices', () => {
//     let todosServices: jest.Mocked<TodosServices>;

//     beforeAll(() => {
//         todosServices = container.resolve(
//             TodosServices
//         ) as jest.Mocked<TodosServices>;

//         todosServices.find = jest.fn();
//     });

//     describe('Fetch todos all', () => {
//         it('Should return all todos', async () => {
//             const todos: ITodo[] = [
//                 {
//                     _id: '1',
//                     name: 'Name 2',
//                     description: 'Description 1',
//                     status: ETodoStatus.PENDING
//                 } as ITodo,
//                 {
//                     _id: '2',
//                     name: 'Name 2',
//                     description: 'Description 2',
//                     status: ETodoStatus.PENDING
//                 } as ITodo
//             ];

//             todosServices.find.mockResolvedValue(todos);

//             const allTodos = await todosServices.find();

//             expect(todosServices.find).toHaveBeenCalledTimes(1);
//             expect(allTodos).toEqual(todos);
//         });
//     });

//     afterEach(() => {
//         jest.resetAllMocks();
//     });
// });

describe('Todos Services tests', () => {
    let conn: Mongoose;
    const todosServices = container.resolve(TodosServices);

    beforeAll(async () => {
        await connection.disconnectMongoDB();

        conn = await connection.connectMongoDB(TEST_DB_URL);
    });

    describe('POST /todos', () => {
        it('Should insert a new document in the collection', async () => {
            const todo: ITodo = await todosServices.create({
                name: 'Name 1',
                description: 'Description 1',
                status: ETodoStatus.PENDING
            });

            expect(todo).toHaveProperty('_id');
            expect(todo).toHaveProperty('name', 'Name 1');
            expect(todo).toHaveProperty('description', 'Description 1');
            expect(todo).toHaveProperty('status', ETodoStatus.PENDING);
        });
    });

    describe('GET /todos', () => {});

    describe('GET /todos/:id', () => {});

    describe('PUT /todos/:id', () => {});

    describe('DELETE /todos/:id', () => {});

    afterAll(async () => {
        await conn.connection.dropCollection('todos');
        await connection.disconnectMongoDB();
    });
});
