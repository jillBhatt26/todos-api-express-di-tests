// import 'reflect-metadata';
// import type { Application } from 'express';
// import type { Mongoose } from 'mongoose';
// import type TestAgent from 'supertest/lib/agent';
// import request from 'supertest';
// import { container } from 'tsyringe';
// import initExpressApp from '@app';
// import { TEST_DB_URL } from '@config/env';
// import { JEST_TIMEOUT } from '@constants';
// import connection from '@db/connection';
// import AuthServices from '../services';

// jest.setTimeout(JEST_TIMEOUT);

// describe('AUTH E2E', () => {
//     let app: Application;
//     let conn: Mongoose;
//     let authServices = container.resolve(AuthServices);
//     let agent: InstanceType<typeof TestAgent>;
//     const BASE_API_URL: string = '/api/auth';

//     beforeAll(async () => {
//         conn = await connection.connectMongoDB(TEST_DB_URL);

//         app = initExpressApp();

//         agent = request.agent(app);
//     });

//     beforeEach(async () => {
//         await authServices.deleteAll();
//     });

//     describe('POST /auth/signup', () => {
//         it('Should check if all signup inputs are provided', async () => {
//             const res = await agent.post(`${BASE_API_URL}/signup`).send({
//                 username: '',
//                 email: ''
//             });

//             expect(res.status).toEqual(400);
//             expect(res.body).toHaveProperty('success', false);
//             expect(res.body).toHaveProperty('error');
//             expect(res.body.error).toHaveProperty(
//                 'message',
//                 'Please provide all user details!'
//             );
//         });

//         it('Should check if signup inputs are not empty', async () => {
//             const res = await agent.post(`${BASE_API_URL}/signup`).send({
//                 username: '',
//                 email: '',
//                 password: ''
//             });

//             expect(res.status).toEqual(400);
//             expect(res.body).toHaveProperty('success', false);
//             expect(res.body).toHaveProperty('error');
//             expect(res.body.error).toHaveProperty(
//                 'message',
//                 'Please provide all user details!'
//             );
//         });

//         it('Should check if username already exists in database', async () => {
//             await authServices.create({
//                 username: 'user1',
//                 email: 'user1@email.com',
//                 password: 'password1'
//             });

//             const usernameTakenRes = await agent
//                 .post(`${BASE_API_URL}/signup`)
//                 .send({
//                     username: 'user1',
//                     email: 'user1@email.com',
//                     password: 'password1'
//                 });

//             expect(usernameTakenRes.status).toBe(400);
//             expect(usernameTakenRes.body).toHaveProperty('success', false);
//             expect(usernameTakenRes.body).toHaveProperty('error');
//             expect(usernameTakenRes.body.error).toHaveProperty(
//                 'message',
//                 'User already exists.Please try with different email or username!'
//             );
//         });

//         it('Should check if email already exists in database', async () => {
//             await authServices.create({
//                 username: 'user1',
//                 email: 'user1@email.com',
//                 password: 'password1'
//             });

//             const emailTakenRes = await agent
//                 .post(`${BASE_API_URL}/signup`)
//                 .send({
//                     username: 'user2',
//                     email: 'user1@email.com',
//                     password: 'password1'
//                 });

//             expect(emailTakenRes.status).toBe(400);
//             expect(emailTakenRes.body).toHaveProperty('success', false);
//             expect(emailTakenRes.body).toHaveProperty('error');
//             expect(emailTakenRes.body.error).toHaveProperty(
//                 'message',
//                 'User already exists.Please try with different email or username!'
//             );
//         });

//         it('Should sign up a new user', async () => {
//             const signupRes = await agent.post(`${BASE_API_URL}/signup`).send({
//                 username: 'user1',
//                 email: 'user1@email.com',
//                 password: 'password1'
//             });

//             expect(signupRes.status).toBe(201);

//             expect(signupRes.header['set-cookie']).toBeDefined();
//             expect(signupRes.header['set-cookie'][0]).toContain('connect.sid');

//             expect(signupRes.body).toHaveProperty('success', true);
//             expect(signupRes.body).toHaveProperty('data');
//             expect(signupRes.body.data).toHaveProperty('newUser');
//             expect(signupRes.body.data.newUser).toHaveProperty('id');
//             expect(signupRes.body.data.newUser).toHaveProperty(
//                 'username',
//                 'user1'
//             );
//             expect(signupRes.body.data.newUser).toHaveProperty(
//                 'email',
//                 'user1@email.com'
//             );
//             expect(signupRes.body.data.newUser).not.toHaveProperty('password');
//         });
//     });

//     afterAll(async () => {
//         await conn.connection.dropCollection('auths');
//         await conn.connection.dropDatabase();
//         await connection.disconnectMongoDB();
//     });
// });

import 'reflect-metadata';
import { Application } from 'express';
import { Mongoose } from 'mongoose';
import request from 'supertest';
import initExpressApp from '@app';
import { JEST_TIMEOUT } from '@constants';
import { TEST_DB_URL } from '@config/env';
import connection from '@db/connection';
import { ETodoStatus } from '@modules/Todo/enums';

jest.setTimeout(JEST_TIMEOUT);

describe('NEW and TEMP TODOS CONTROLLERS SUITE', () => {
    let app: Application;
    let conn: Mongoose;
    const BASE_API_URL: string = `/api/todos`;
    let testTodoID: string;
    let nonTodoID: string = '623a0996cd97284ad4fcd9c6';

    beforeAll(async () => {
        conn = await connection.connectMongoDB(TEST_DB_URL);

        app = initExpressApp();
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
            const response = await request(app).post(BASE_API_URL).send({
                name: '',
                description: '',
                status: ETodoStatus.PENDING
            });

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
            const response = await request(app).post(BASE_API_URL).send({
                name: 'Without status task name 1',
                description: 'Without status task description 1'
            });

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
            const response = await request(app).post(BASE_API_URL).send({
                name: 'Test task name 1',
                description: 'Test task description 1',
                status: ETodoStatus.PENDING
            });

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
            const response = await request(app).post(BASE_API_URL).send({
                name: 'Test task name 1',
                description: 'Test task description 1'
            });

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
            const response = await request(app).get(BASE_API_URL);

            expect(response.status).toEqual(200);
            expect(response.body.success).toEqual(true);
            expect(response.body.data).toHaveProperty('tasks');
            expect(response.body.data.tasks).toHaveLength(3);
        });
    });

    describe('GET /todos/:id', () => {
        it('Should not find a task with wrong id', async () => {
            const response = await request(app).get(
                `${BASE_API_URL}/${nonTodoID}`
            );

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
            const response = await request(app).get(
                `${BASE_API_URL}/${testTodoID}`
            );

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
                .put(`${BASE_API_URL}/${testTodoID}`)
                .send({
                    status: ETodoStatus.PROGRESS
                });

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
            const response = await request(app).delete(
                `${BASE_API_URL}/${testTodoID}`
            );

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
