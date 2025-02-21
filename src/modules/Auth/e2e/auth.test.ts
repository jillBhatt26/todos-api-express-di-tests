import 'reflect-metadata';
import type { Application } from 'express';
import type { Mongoose } from 'mongoose';
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
    const BASE_API_URL: string = '/api/auth';

    beforeAll(async () => {
        conn = await connection.connectMongoDB(TEST_DB_URL);

        app = initExpressApp();

        await authServices.deleteAll();
    });

    afterEach(async () => {
        await authServices.deleteAll();
    });

    describe('POST /auth/signup', () => {
        it('Should validate signup inputs', async () => {
            const response = await request(app)
                .post(`${BASE_API_URL}/signup`)
                .send({
                    username: '',
                    email: ''
                });

            expect(response.status).toEqual(400);

            expect(response.body).toHaveProperty('success', false);
            expect(response.body).toHaveProperty('error');
            expect(response.body.error).toHaveProperty('message');
            expect(response.body.error.message).toEqual(
                'Please provide all user details!'
            );
        });

        it('Should validate signup inputs', async () => {
            const response = await request(app)
                .post(`${BASE_API_URL}/signup`)
                .send({
                    username: '',
                    email: '',
                    password: ''
                });

            expect(response.status).toEqual(400);

            expect(response.body).toHaveProperty('success', false);
            expect(response.body).toHaveProperty('error');
            expect(response.body.error).toHaveProperty('message');
            expect(response.body.error.message).toEqual(
                'Please provide all user details!'
            );
        });

        it('Should check if username or email is taken', async () => {
            await authServices.create({
                username: 'user1',
                email: 'user1@email.com',
                password: 'password@1'
            });

            const response = await request(app)
                .post(`${BASE_API_URL}/signup`)
                .send({
                    username: 'user1',
                    email: 'user1@email.com',
                    password: 'password@1'
                });

            expect(response.status).toEqual(400);

            expect(response.body).toHaveProperty('success', false);
            expect(response.body).toHaveProperty('error');
            expect(response.body.error).toHaveProperty('message');
            expect(response.body.error.message).toEqual(
                'User already exists.Please try with different email or username!'
            );
        });

        it('Should sign up a new user', async () => {
            const response = await request(app)
                .post(`${BASE_API_URL}/signup`)
                .send({
                    username: 'user1',
                    email: 'user1@email.com',
                    password: 'password1'
                });
            expect(response.status).toEqual(201);

            expect(response.header['set-cookie']).toBeDefined();
            expect(response.header['set-cookie'][0]).toContain('connect.sid');

            // expect(newUserRes.header['set-cookie']).toBeUndefined();

            expect(response.body).toHaveProperty('success', true);
            expect(response.body).toHaveProperty('data');
            expect(response.body.data).toHaveProperty('newUser');
            expect(response.body.data.newUser).toHaveProperty('id');
            expect(response.body.data.newUser).toHaveProperty(
                'username',
                'user1'
            );
            expect(response.body.data.newUser).toHaveProperty(
                'email',
                'user1@email.com'
            );
            expect(response.body.data.newUser).not.toHaveProperty('password');
        });

        it('Should check if user is already logged in', async () => {
            const newSignupRes = await request(app)
                .post(`${BASE_API_URL}/signup`)
                .send({
                    username: 'user1',
                    email: 'user1@email.com',
                    password: 'password1'
                });
            expect(newSignupRes.status).toEqual(201);

            expect(newSignupRes.header['set-cookie']).toBeDefined();
            expect(newSignupRes.header['set-cookie'][0]).toContain(
                'connect.sid'
            );

            expect(newSignupRes.body).toHaveProperty('success', true);

            const response = await request(app)
                .post(`${BASE_API_URL}/signup`)
                .set('Cookie', newSignupRes.headers['set-cookie'])
                .send({
                    username: 'user1',
                    email: 'user1@email.com',
                    password: 'password1'
                });

            expect(response.status).toEqual(400);
            expect(response.body).toHaveProperty('success', false);
            expect(response.body).toHaveProperty('error');
            expect(response.body.error).toHaveProperty('message');
            expect(response.body.error.message).toEqual(
                'You are already logged in!'
            );
        });
    });

    describe('POST /auth/login', () => {
        it('Should validate login inputs', async () => {
            const response = await request(app)
                .post(`${BASE_API_URL}/login`)
                .send({
                    username: ''
                });

            expect(response.status).toEqual(400);

            expect(response.body).toHaveProperty('success', false);
            expect(response.body).toHaveProperty('error');
            expect(response.body.error).toHaveProperty('message');
            expect(response.body.error.message).toEqual(
                'Either username or email required!'
            );
        });

        it('Should validate login inputs', async () => {
            const response = await request(app)
                .post(`${BASE_API_URL}/login`)
                .send({
                    username: 'user1',
                    password: ''
                });

            expect(response.status).toEqual(400);

            expect(response.body).toHaveProperty('success', false);
            expect(response.body).toHaveProperty('error');
            expect(response.body.error).toHaveProperty('message');
            expect(response.body.error.message).toEqual('Password required!');
        });

        it('Should check if user exists', async () => {
            const response = await request(app)
                .post(`${BASE_API_URL}/login`)
                .send({
                    username: 'user2',
                    password: 'password2'
                });

            expect(response.status).toEqual(404);

            expect(response.body).toHaveProperty('success', false);
            expect(response.body).toHaveProperty('error');
            expect(response.body.error).toHaveProperty('message');
            expect(response.body.error.message).toEqual(
                'User not found! Please sign up first!'
            );
        });

        it('Should check if password is correct', async () => {
            const signupRes = await request(app)
                .post(`${BASE_API_URL}/signup`)
                .send({
                    username: 'user1',
                    email: 'user1@email.com',
                    password: 'password1'
                });
            expect(signupRes.status).toEqual(201);

            expect(signupRes.header['set-cookie']).toBeDefined();
            expect(signupRes.header['set-cookie'][0]).toContain('connect.sid');

            // expect(newUserRes.header['set-cookie']).toBeUndefined();

            expect(signupRes.body).toHaveProperty('success', true);

            const response = await request(app)
                .post(`${BASE_API_URL}/login`)
                .send({
                    username: 'user1',
                    password: 'password2'
                });

            expect(response.status).toEqual(400);

            expect(response.body).toHaveProperty('success', false);
            expect(response.body).toHaveProperty('error');
            expect(response.body.error).toHaveProperty('message');
            expect(response.body.error.message).toEqual('Incorrect password!');
        });

        it('Should log the user in', async () => {
            const signupRes = await request(app)
                .post(`${BASE_API_URL}/signup`)
                .send({
                    username: 'user1',
                    email: 'user1@email.com',
                    password: 'password1'
                });
            expect(signupRes.status).toEqual(201);

            expect(signupRes.header['set-cookie']).toBeDefined();
            expect(signupRes.header['set-cookie'][0]).toContain('connect.sid');

            expect(signupRes.body).toHaveProperty('success', true);

            const { newUser: signedUpUser } = signupRes.body.data;

            const response = await request(app)
                .post(`${BASE_API_URL}/login`)
                .send({
                    username: 'user1',
                    password: 'password1'
                });

            expect(response.status).toEqual(200);

            expect(response.body).toHaveProperty('success', true);
            expect(response.body).toHaveProperty('data');
            expect(response.body.data).toHaveProperty('user');
            expect(response.body.data.user).toHaveProperty(
                'id',
                signedUpUser.id
            );
            expect(response.body.data.user).toHaveProperty(
                'username',
                signedUpUser.username
            );
            expect(response.body.data.user).not.toHaveProperty('password');
        });

        it('Should check if user has already logged in', async () => {
            const signupRes = await request(app)
                .post(`${BASE_API_URL}/signup`)
                .send({
                    username: 'user1',
                    email: 'user1@email.com',
                    password: 'password1'
                });

            expect(signupRes.status).toEqual(201);

            expect(signupRes.header['set-cookie']).toBeDefined();
            expect(signupRes.header['set-cookie'][0]).toContain('connect.sid');

            expect(signupRes.body).toHaveProperty('success', true);

            const reLoginRes = await request(app)
                .post(`${BASE_API_URL}/login`)
                .set('Cookie', signupRes.headers['set-cookie'])
                .send({
                    username: 'user1',
                    password: 'password1'
                });

            expect(reLoginRes.status).toEqual(400);
            expect(reLoginRes.body).toHaveProperty('success', false);
        });
    });

    afterAll(async () => {
        await conn.connection.dropCollection('auths');
        await conn.connection.dropDatabase();
        await connection.disconnectMongoDB();
    });
});
