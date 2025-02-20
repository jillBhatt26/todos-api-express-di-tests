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
        it('Should sign up a new user', async () => {
            const newUserRes = await request(app)
                .post(`${BASE_API_URL}/signup`)
                .send({
                    username: 'user1',
                    email: 'user1@email.com',
                    password: 'password1'
                });

            expect(newUserRes.status).toEqual(201);

            // expect(newUserRes.header['set-cookie']).toBeDefined();
            // expect(newUserRes.header['set-cookie'][0]).toContain('connect.sid');

            expect(newUserRes.body).toHaveProperty('success', true);
            // expect(newUserRes.body).toHaveProperty('data');
            // expect(newUserRes.body.data).toHaveProperty('newUser');
            // expect(newUserRes.body.data.newUser).toHaveProperty('id');
            // expect(newUserRes.body.data.newUser).toHaveProperty(
            //     'username',
            //     'user1'
            // );
            // expect(newUserRes.body.data.newUser).toHaveProperty(
            //     'email',
            //     'user1@email.com'
            // );
            // expect(newUserRes.body.data.newUser).not.toHaveProperty('password');
        });
    });

    afterAll(async () => {
        await conn.connection.dropCollection('auths');
        await conn.connection.dropDatabase();
        await connection.disconnectMongoDB();
    });
});
