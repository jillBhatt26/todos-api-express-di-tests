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

    beforeEach(async () => {
        await todosServices.deleteAll();
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

    describe('GET /todos', () => {
        it('Should return all documents of collection', async () => {
            const todos: ITodo[] = await todosServices.find();

            expect(todos).not.toBeNull();
            expect(todos).not.toBeUndefined();
            expect(todos).toHaveLength(0); // since we're deleting all the documents before each test
        });
    });

    describe('GET /todos/:id', () => {
        it('Should find the task with the provided id', async () => {
            const newTodo: ITodo = await todosServices.create({
                name: 'Name 2',
                description: 'Description 2',
                status: ETodoStatus.PENDING
            });

            const todo: ITodo | null = await todosServices.findById(newTodo.id);

            expect(todo).not.toBeNull();
            expect(todo).not.toBeUndefined();

            expect(todo).toHaveProperty('_id');
            expect(todo).toHaveProperty('name');
            expect(todo).toHaveProperty('description');
            expect(todo).toHaveProperty('status');

            expect(todo!.id).toStrictEqual(newTodo.id);
            expect(todo!.name).toStrictEqual(newTodo.name);
            expect(todo!.description).toStrictEqual(newTodo.description);
            expect(todo!.status).toStrictEqual(newTodo.status);
        });
    });

    describe('PUT /todos/:id', () => {
        it('Should update a document', async () => {
            const newTodo: ITodo = await todosServices.create({
                name: 'Name 2',
                description: 'Description 2',
                status: ETodoStatus.PENDING
            });

            const updatedTodo: ITodo | null =
                await todosServices.findByIdAndUpdate(newTodo.id, {
                    status: ETodoStatus.PROGRESS
                });

            expect(updatedTodo).not.toBeNull();
            expect(updatedTodo).not.toBeUndefined();

            expect(updatedTodo).toHaveProperty('_id');
            expect(updatedTodo).toHaveProperty('name');
            expect(updatedTodo).toHaveProperty('description');
            expect(updatedTodo).toHaveProperty('status');

            expect(updatedTodo!.id).toStrictEqual(newTodo.id);
            expect(updatedTodo!.name).toStrictEqual(newTodo.name);
            expect(updatedTodo!.description).toStrictEqual(newTodo.description);
            expect(updatedTodo!.status).toStrictEqual(ETodoStatus.PROGRESS);
        });
    });

    describe('DELETE /todos/:id', () => {
        it('Should delete a document', async () => {
            const newTodo: ITodo = await todosServices.create({
                name: 'Name 2',
                description: 'Description 2',
                status: ETodoStatus.PENDING
            });

            const deletedTodo: ITodo | null =
                await todosServices.findByIdAndDelete(newTodo.id);

            expect(deletedTodo).not.toBeNull();
            expect(deletedTodo).not.toBeUndefined();
        });
    });

    afterAll(async () => {
        await conn.connection.dropCollection('todos');
        await conn.connection.dropDatabase();
        await connection.disconnectMongoDB();
    });
});
