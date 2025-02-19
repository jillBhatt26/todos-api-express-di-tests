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

    // beforeEach(async () => {
    //     await authServices.deleteAll();
    // });

    describe('POST /auth/signup', () => {
        it('Should check if all signup inputs are provided', async () => {
            const res = await agent.post(`${BASE_API_URL}/signup`).send({
                username: '',
                email: ''
            });

            expect(res.status).toEqual(400);
            expect(res.body).toHaveProperty('success', false);
            expect(res.body).toHaveProperty('error');
            expect(res.body.error).toHaveProperty(
                'message',
                'Please provide all user details!'
            );
        });

        it('Should check if signup inputs are not empty', async () => {
            const res = await agent.post(`${BASE_API_URL}/signup`).send({
                username: '',
                email: '',
                password: ''
            });

            expect(res.status).toEqual(400);
            expect(res.body).toHaveProperty('success', false);
            expect(res.body).toHaveProperty('error');
            expect(res.body.error).toHaveProperty(
                'message',
                'Please provide all user details!'
            );
        });

        it('Should check if username already exists in database', async () => {
            await authServices.create({
                username: 'user1',
                email: 'user1@email.com',
                password: 'password1'
            });

            const usernameTakenRes = await agent
                .post(`${BASE_API_URL}/signup`)
                .send({
                    username: 'user1',
                    email: 'user1@email.com',
                    password: 'password1'
                });

            expect(usernameTakenRes.status).toBe(400);
            expect(usernameTakenRes.body).toHaveProperty('success', false);
            expect(usernameTakenRes.body).toHaveProperty('error');
            expect(usernameTakenRes.body.error).toHaveProperty(
                'message',
                'User already exists.Please try with different email or username!'
            );
        });

        it('Should check if email already exists in database', async () => {
            await authServices.create({
                username: 'user1',
                email: 'user1@email.com',
                password: 'password1'
            });

            const emailTakenRes = await agent
                .post(`${BASE_API_URL}/signup`)
                .send({
                    username: 'user2',
                    email: 'user1@email.com',
                    password: 'password1'
                });

            expect(emailTakenRes.status).toBe(400);
            expect(emailTakenRes.body).toHaveProperty('success', false);
            expect(emailTakenRes.body).toHaveProperty('error');
            expect(emailTakenRes.body.error).toHaveProperty(
                'message',
                'User already exists.Please try with different email or username!'
            );
        });

        it('Should sign up a new user', async () => {
            const signupRes = await agent.post(`${BASE_API_URL}/signup`).send({
                username: 'user1',
                email: 'user1@email.com',
                password: 'password1'
            });

            expect(signupRes.status).toEqual(201);
            expect(signupRes.body).toHaveProperty('success', true);
            expect(signupRes.body).toHaveProperty('data');
            expect(signupRes.body.data).toHaveProperty('newUser');
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

        it('Should check if user is already logged in', async () => {
            // NOTE: Using agent we can use persisted session info which is not available in standalone request(app).post(URL) method. This doubles down as a test for session as well.
            const existingSignupRes = await agent
                .post(`${BASE_API_URL}/signup`)
                .send({
                    username: 'user1',
                    email: 'user1@email.com',
                    password: 'password1'
                });

            expect(existingSignupRes.status).toBe(400);
            expect(existingSignupRes.body).toHaveProperty('success', false);
            expect(existingSignupRes.body).toHaveProperty('error');
            expect(existingSignupRes.body.error).toHaveProperty(
                'message',
                'You are already logged in!'
            );
        });
    });

    // describe('GET /auth', () => {
    //     it('Should check if user is logged in', async () => {});
    //     it('Should send logged in user info', async () => {});
    //     it('Should error if no user is logged in', async () => {});
    // });

    // describe('POST /auth/login', () => {
    //     it('Should check if user is already logged in', async () => {});
    //     it('Should validate login inputs', async () => {});
    //     it('Should check if user exists', async () => {});
    //     it('Should validate password', async () => {});
    //     it('Should start a new session', async () => {});
    // });

    // describe('POST /auth/logout', () => {
    //     it('Should check if user is logged in', async () => {});
    //     it('Should destroy the session', async () => {});
    // });

    // describe('PUT /auth', () => {
    //     it('Should check if user is logged in', async () => {});
    //     it('Should validate user inputs', async () => {});
    //     it('Should check if username and/or email are available', async () => {});
    //     it('Should update the auth document', async () => {});
    // });

    // describe('DELETE /auth', () => {
    //     it('Should check if user is logged in', async () => {});
    //     it('Should destroy the session', async () => {});
    //     it('Should delete the auth document', async () => {});
    // });

    afterAll(async () => {
        await conn.connection.dropCollection('auths');
        await conn.connection.dropDatabase();
        await connection.disconnectMongoDB();
    });
});
