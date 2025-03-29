import 'reflect-metadata';
import mongoose, { Mongoose, Schema } from 'mongoose';
import { container } from 'tsyringe';
import { jest } from '@jest/globals';
import { TEST_DB_URL } from '@config/env';
import { JEST_TIMEOUT } from '@constants';
import connection from '@db/connection';
import { ITodo } from '@modules/Todo/interfaces';
import { ETodoStatus } from '@modules/Todo/enums';
import TodosServices from '..';
import AuthServices from '@modules/Auth/services';

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
    const authServices = container.resolve(AuthServices);
    let userID: mongoose.Types.ObjectId;

    beforeAll(async () => {
        await connection.disconnectMongoDB();

        conn = await connection.connectMongoDB(TEST_DB_URL);
    });

    beforeAll(async () => {
        // create a user to use userID value
        const newUser = await authServices.create({
            username: 'user1',
            email: 'user1@email.com',
            password: 'password1'
        });

        expect(newUser).toBeDefined();
        expect(newUser.id).toBeDefined();
        expect(newUser._id).toBeDefined();

        userID = newUser._id as mongoose.Types.ObjectId;
    });

    beforeEach(async () => {
        await todosServices.deleteAll();

        expect(userID).toBeDefined();
    });

    describe('CREATE TODO', () => {
        it('Should insert a new document in the collection', async () => {
            const todo: ITodo = await todosServices.create({
                name: 'Name 1',
                description: 'Description 1',
                status: ETodoStatus.PENDING,
                userID
            });

            expect(todo).toHaveProperty('_id');
            expect(todo).toHaveProperty('name', 'Name 1');
            expect(todo).toHaveProperty('description', 'Description 1');
            expect(todo).toHaveProperty('status', ETodoStatus.PENDING);
            expect(todo).toHaveProperty('userID', userID);
        });
    });

    describe('GET ALL TODOS', () => {
        it('Should return all documents of collection', async () => {
            const todos: ITodo[] = await todosServices.find({ userID });

            expect(todos).not.toBeNull();
            expect(todos).not.toBeUndefined();
            expect(todos).toHaveLength(0); // since we're deleting all the documents before each test
        });
    });

    describe('GET TODO BY ID', () => {
        it('Should find the task with the provided id', async () => {
            const newTodo: ITodo = await todosServices.create({
                name: 'Name 2',
                description: 'Description 2',
                status: ETodoStatus.PENDING,
                userID
            });

            const todo: ITodo | null = await todosServices.findById(newTodo.id);

            expect(todo).not.toBeNull();
            expect(todo).not.toBeUndefined();

            expect(todo).toHaveProperty('_id');
            expect(todo).toHaveProperty('name');
            expect(todo).toHaveProperty('description');
            expect(todo).toHaveProperty('status');
            expect(todo).toHaveProperty('userID');

            expect(todo!.id).toStrictEqual(newTodo.id);
            expect(todo!.name).toStrictEqual(newTodo.name);
            expect(todo!.description).toStrictEqual(newTodo.description);
            expect(todo!.status).toStrictEqual(newTodo.status);
            expect(todo!.userID).toStrictEqual(userID);
        });
    });

    describe('UPDATE TODO', () => {
        it('Should update a document', async () => {
            const newTodo: ITodo = await todosServices.create({
                name: 'Name 2',
                description: 'Description 2',
                status: ETodoStatus.PENDING,
                userID
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
            expect(updatedTodo).toHaveProperty('userID');

            expect(updatedTodo!.id).toStrictEqual(newTodo.id);
            expect(updatedTodo!.name).toStrictEqual(newTodo.name);
            expect(updatedTodo!.description).toStrictEqual(newTodo.description);
            expect(updatedTodo!.status).toStrictEqual(ETodoStatus.PROGRESS);
            expect(updatedTodo!.userID).toStrictEqual(userID);
        });
    });

    describe('DELETE TODO', () => {
        it('Should delete a document', async () => {
            const newTodo: ITodo = await todosServices.create({
                name: 'Name 2',
                description: 'Description 2',
                status: ETodoStatus.PENDING,
                userID
            });

            const deletedTodo: ITodo | null =
                await todosServices.findByIdAndDelete(newTodo.id);

            expect(deletedTodo).not.toBeNull();
            expect(deletedTodo).not.toBeUndefined();
        });
    });

    afterAll(async () => {
        await authServices.deleteAll();
        await conn.connection.dropCollection('todos');
        await conn.connection.dropCollection('auths');
        await conn.connection.dropDatabase();
        await connection.disconnectMongoDB();
    });
});
