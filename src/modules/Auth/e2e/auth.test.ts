import 'reflect-metadata';
import type { Application } from 'express';
import type { Mongoose } from 'mongoose';
import type TestAgent from 'supertest/lib/agent';
import request from 'supertest';
import { container } from 'tsyringe';
import initExpressApp from '@app';
import { TEST_DB_URL } from '@config/env';
import { JEST_TIMEOUT } from '@constants';
import connection from '@db/connection';
import AuthServices from '../services';

jest.setTimeout(JEST_TIMEOUT);

describe('AUTH E2E', () => {
    let app: Application;
    let conn: Mongoose;
    let authServices = container.resolve(AuthServices);
    let agent: InstanceType<typeof TestAgent>;
    const BASE_API_URL: string = '/api/auth';

    beforeAll(async () => {
        conn = await connection.connectMongoDB(TEST_DB_URL);

        app = initExpressApp();

        agent = request.agent(app);
    });

    beforeEach(async () => {
        await authServices.deleteAll();
    });

    describe('POST /auth/signup', () => {
        // it('Should check if all signup inputs are provided', async () => {
        //     const res = await agent.post(`${BASE_API_URL}/signup`).send({
        //         username: '',
        //         email: ''
        //     });

        //     expect(res.status).toEqual(400);
        //     expect(res.body).toHaveProperty('success', false);
        //     expect(res.body).toHaveProperty('error');
        //     expect(res.body.error).toHaveProperty(
        //         'message',
        //         'Please provide all user details!'
        //     );
        // });

        // it('Should check if signup inputs are not empty', async () => {
        //     const res = await agent.post(`${BASE_API_URL}/signup`).send({
        //         username: '',
        //         email: '',
        //         password: ''
        //     });

        //     expect(res.status).toEqual(400);
        //     expect(res.body).toHaveProperty('success', false);
        //     expect(res.body).toHaveProperty('error');
        //     expect(res.body.error).toHaveProperty(
        //         'message',
        //         'Please provide all user details!'
        //     );
        // });

        // it('Should check if username already exists in database', async () => {
        //     await authServices.create({
        //         username: 'user1',
        //         email: 'user1@email.com',
        //         password: 'password1'
        //     });

        //     const usernameTakenRes = await agent
        //         .post(`${BASE_API_URL}/signup`)
        //         .send({
        //             username: 'user1',
        //             email: 'user1@email.com',
        //             password: 'password1'
        //         });

        //     expect(usernameTakenRes.status).toBe(400);
        //     expect(usernameTakenRes.body).toHaveProperty('success', false);
        //     expect(usernameTakenRes.body).toHaveProperty('error');
        //     expect(usernameTakenRes.body.error).toHaveProperty(
        //         'message',
        //         'User already exists.Please try with different email or username!'
        //     );
        // });

        // it('Should check if email already exists in database', async () => {
        //     await authServices.create({
        //         username: 'user1',
        //         email: 'user1@email.com',
        //         password: 'password1'
        //     });

        //     const emailTakenRes = await agent
        //         .post(`${BASE_API_URL}/signup`)
        //         .send({
        //             username: 'user2',
        //             email: 'user1@email.com',
        //             password: 'password1'
        //         });

        //     expect(emailTakenRes.status).toBe(400);
        //     expect(emailTakenRes.body).toHaveProperty('success', false);
        //     expect(emailTakenRes.body).toHaveProperty('error');
        //     expect(emailTakenRes.body.error).toHaveProperty(
        //         'message',
        //         'User already exists.Please try with different email or username!'
        //     );
        // });

        it('Should sign up a new user', async () => {
            const signupRes = await agent.post(`${BASE_API_URL}/signup`).send({
                username: 'user1',
                email: 'user1@email.com',
                password: 'password1'
            });

            expect(signupRes.status).toBe(201);

            expect(signupRes.header['set-cookie']).toBeDefined();
            expect(signupRes.header['set-cookie'][0]).toContain('connect.sid');

            expect(signupRes.body).toHaveProperty('success', true);
            expect(signupRes.body).toHaveProperty('data');
            expect(signupRes.body.data).toHaveProperty('newUser');
            expect(signupRes.body.data.newUser).toHaveProperty('id');
            expect(signupRes.body.data.newUser).toHaveProperty(
                'username',
                'user1'
            );
            expect(signupRes.body.data.newUser).toHaveProperty(
                'email',
                'user1@email.com'
            );
            expect(signupRes.body.data.newUser).not.toHaveProperty('password');
        });
    });

    afterAll(async () => {
        await conn.connection.dropCollection('auths');
        await conn.connection.dropDatabase();
        await connection.disconnectMongoDB();
    });
});
