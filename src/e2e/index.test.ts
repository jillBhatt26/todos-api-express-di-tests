import 'reflect-metadata';
import { Application } from 'express';
import request from 'supertest';
import initExpressApp from '@app';
import { JEST_TIMEOUT } from '@constants';
import connection from '@db/connection';

jest.setTimeout(JEST_TIMEOUT);

describe('Check supertest e2e', () => {
    let app: Application;

    beforeAll(async () => {
        app = initExpressApp();

        await connection.connectMongoDB();
    });

    it('Should check e2e setup', () => {
        const addition = (a: number, b: number) => a + b;

        const sum = addition(1, 2);

        expect(sum).not.toBe(1);
        expect(sum).toBe(3);
    });

    it('Should test the info route', async () => {
        const response = await request(app).get('/info');

        expect(response.status).toEqual(200);
        expect(response.body.success).toEqual(true);
    });

    afterAll(async () => {
        await connection.disconnectMongoDB();
    });
});
