import 'reflect-metadata';
import { Application } from 'express';
import mongoose, { Mongoose, Schema } from 'mongoose';
import request from 'supertest';
import { container } from 'tsyringe';
import initExpressApp from '@app';
import { JEST_TIMEOUT } from '@constants';
import { TEST_DB_URL } from '@config/env';
import connection from '@db/connection';
import AuthServices from '@modules/Auth/services';
import PasswordUtils from '@modules/Auth/utils/Password';
import { IAuthModel, ISignupData } from '@modules/Auth/interfaces';
import { ETodoStatus } from '../enums';

jest.setTimeout(JEST_TIMEOUT);

describe('TODOS CONTROLLERS SUITE', () => {
    let app: Application;
    let conn: Mongoose;
    const AUTH_API_URL: string = `/api/auth`;
    const TODOS_API_URL: string = `/api/todos`;
    const authServices = container.resolve(AuthServices);
    const passwordUtils = container.resolve(PasswordUtils);
    let testTodoID: string;
    let nonTodoID: string = '623a0996cd97284ad4fcd9c6';
    const signupData: ISignupData = {
        username: 'user1',
        email: 'user1@email.com',
        password: 'password1'
    };
    let userID: mongoose.Types.ObjectId;
    let cookie: string;
    let activeUserID: mongoose.Types.ObjectId;

    const generateUserToSignup = (): Promise<IAuthModel> =>
        new Promise(async (resolve, reject) => {
            try {
                const hashedPassword = await passwordUtils.hash(
                    signupData.password
                );

                const newUser = await authServices.create({
                    ...signupData,
                    password: hashedPassword
                });

                return resolve(newUser);
            } catch (error: unknown) {
                return reject();
            }
        });

    beforeAll(async () => {
        conn = await connection.connectMongoDB(TEST_DB_URL);

        app = initExpressApp();
    });

    // before running all the tests sign up a new user
    beforeAll(async () => {
        expect(conn).toBeDefined();
        expect(app).toBeDefined();

        const newUser = await generateUserToSignup();

        expect(newUser).toBeDefined();
        expect(newUser._id).toBeDefined();

        userID = newUser._id as mongoose.Types.ObjectId;
    });

    // login before running all the tests
    beforeAll(async () => {
        expect(userID).toBeDefined();

        const response = await request(app)
            .post(`${AUTH_API_URL}/login`)
            .send(signupData);

        expect(response.status).toBe(200);
        expect(response.body.success).toStrictEqual(true);

        // body assertions
        expect(response.body.data).toHaveProperty('user');
        expect(response.body.data.user).toHaveProperty('id');
        expect(response.body.data.user).toHaveProperty('username');
        expect(response.body.data.user).toHaveProperty('email');

        activeUserID = response.body.data.user.id;

        // headers assertions
        expect(response.headers).toHaveProperty('set-cookie');
        expect(response.headers['set-cookie'][0]).toContain('connect.sid');

        cookie = response.headers['set-cookie'];
    });

    beforeEach(() => {
        expect(cookie).toBeDefined();
        expect(activeUserID).toBeDefined();
    });

    describe('INFO', () => {
        it('Should test the info route', async () => {
            const response = await request(app).get('/api/info');

            expect(response.status).toEqual(200);
            expect(response.body.success).toEqual(true);
        });
    });

    describe('POST /todos', () => {
        it('Should validate the create todo data', async () => {
            const response = await request(app)
                .post(TODOS_API_URL)
                .send({
                    name: '',
                    description: '',
                    status: ETodoStatus.PENDING
                })
                .set('Cookie', cookie);

            expect(response.status).toEqual(400);
            expect(response.body.success).toEqual(false);
            expect(response.body).not.toHaveProperty('data');
            expect(response.body).toHaveProperty('error');
            expect(response.body.error).toHaveProperty('code');
            expect(response.body.error).toHaveProperty('message');
            expect(response.body.error.message).toEqual(
                'Please provide all task details'
            );
        });

        it('Should validate the create todo data without status', async () => {
            const response = await request(app)
                .post(TODOS_API_URL)
                .send({
                    name: 'Without status task name 1',
                    description: 'Without status task description 1'
                })
                .set('Cookie', cookie);

            expect(response.status).toEqual(201);
            expect(response.status).not.toEqual(400);
            expect(response.body).toHaveProperty('success');
            expect(response.body).not.toHaveProperty('error');
            expect(response.body.success).toEqual(true);
            expect(response.body.success).not.toEqual(false);
            expect(response.body).toHaveProperty('data');
            expect(response.body.data).toHaveProperty('newTask');
            expect(response.body.data.newTask).toHaveProperty('_id');
            expect(response.body.data.newTask).toHaveProperty(
                'name',
                'Without status task name 1'
            );
            expect(response.body.data.newTask).toHaveProperty(
                'description',
                'Without status task description 1'
            );
            expect(response.body.data.newTask).toHaveProperty(
                'status',
                ETodoStatus.PENDING
            );
        });

        it('Create a new task', async () => {
            const response = await request(app)
                .post(TODOS_API_URL)
                .send({
                    name: 'Test task name 1',
                    description: 'Test task description 1',
                    status: ETodoStatus.PENDING
                })
                .set('Cookie', cookie);

            expect(response.status).toEqual(201);
            expect(response.body.success).toEqual(true);
            expect(response.body.data).toHaveProperty('newTask');

            if (
                response.body.data &&
                response.body.data.newTask &&
                response.body.data.newTask._id
            )
                testTodoID = response.body.data.newTask._id;
        });

        it('Create a new task with default status', async () => {
            const response = await request(app)
                .post(TODOS_API_URL)
                .send({
                    name: 'Test task name 1',
                    description: 'Test task description 1'
                })
                .set('Cookie', cookie);

            expect(response.status).toEqual(201);
            expect(response.body.success).toEqual(true);
            expect(response.body.data).toHaveProperty('newTask');

            if (
                response.body.data &&
                response.body.data.newTask &&
                response.body.data.newTask._id
            )
                testTodoID = response.body.data.newTask._id;
        });
    });

    describe('GET /todos', () => {
        it('Get an array of all tasks', async () => {
            const response = await request(app)
                .get(TODOS_API_URL)
                .set('Cookie', cookie);

            expect(response.status).toEqual(200);
            expect(response.body.success).toEqual(true);
            expect(response.body.data).toHaveProperty('tasks');
            expect(response.body.data.tasks).toHaveLength(3);
        });
    });

    describe('GET /todos/:id', () => {
        it('Should not find a task with wrong id', async () => {
            const response = await request(app)
                .get(`${TODOS_API_URL}/${nonTodoID}`)
                .set('Cookie', cookie);

            expect(response.status).toEqual(400);
            expect(response.body.success).toEqual(false);

            expect(response.body).not.toHaveProperty('data');
            expect(response.body).toHaveProperty('error');

            expect(response.body.error).toHaveProperty('code');
            expect(response.body.error).toHaveProperty('message');
            expect(response.body.error.message).toStrictEqual(
                'Task not found!'
            );
        });

        it('Should find a task with given id', async () => {
            const response = await request(app)
                .get(`${TODOS_API_URL}/${testTodoID}`)
                .set('Cookie', cookie);

            expect(response.status).toEqual(200);
            expect(response.body.success).toEqual(true);

            expect(response.body.data).toHaveProperty('task');

            expect(response.body.data.task).not.toBeNull();

            expect(response.body.data.task).toHaveProperty('_id', testTodoID);
        });
    });

    describe('PUT /todos/:id', () => {
        it('Should update the task with the given id', async () => {
            const response = await request(app)
                .put(`${TODOS_API_URL}/${testTodoID}`)
                .send({
                    status: ETodoStatus.PROGRESS
                })
                .set('Cookie', cookie);

            expect(response.status).toEqual(200);
            expect(response.body.success).toEqual(true);

            expect(response.body.data).toHaveProperty('updatedTask');

            expect(response.body.data.updatedTask).not.toBeNull();
            expect(response.body.data.updatedTask).toHaveProperty(
                '_id',
                testTodoID
            );
            expect(response.body.data.updatedTask).not.toHaveProperty(
                'status',
                ETodoStatus.PENDING
            );
            expect(response.body.data.updatedTask).toHaveProperty(
                'status',
                ETodoStatus.PROGRESS
            );
        });
    });

    describe('DELETE /todos/:id', () => {
        it('Should delete the task with given id', async () => {
            const response = await request(app)
                .delete(`${TODOS_API_URL}/${testTodoID}`)
                .set('Cookie', cookie);

            expect(response.status).toEqual(200);
            expect(response.body.success).toEqual(true);

            expect(response.body.data).toHaveProperty('deletedTodo');
            expect(response.body.data.deletedTodo).not.toBeNull();

            expect(response.body.data.deletedTodo).toHaveProperty(
                '_id',
                testTodoID
            );
        });
    });

    afterAll(async () => {
        await conn.connection.dropCollection('todos');
        await conn.connection.dropDatabase();
        await connection.disconnectMongoDB();
    });
});
