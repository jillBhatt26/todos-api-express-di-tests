import 'reflect-metadata';
import type { Mongoose } from 'mongoose';
import { container } from 'tsyringe';
import connection from '@db/connection';
import { TEST_DB_URL } from '@config/env';
import AuthServices from '..';

describe('AUTH SERVICES TESTS', () => {
    let conn: Mongoose;
    const authServices = container.resolve(AuthServices);

    beforeAll(async () => {
        await connection.disconnectMongoDB();

        conn = await connection.connectMongoDB(TEST_DB_URL);
    });

    beforeEach(async () => {
        await authServices.deleteAll();
    });

    describe('CREATE', () => {
        it('should insert auth document', async () => {
            const newUser = await authServices.create(
                {
                    username: 'testuser1',
                    email: 'test@test.com',
                    password: 'testpassword1'
                },
                { password: 0 }
            );

            expect(newUser).not.toBeNull();
            expect(newUser).toHaveProperty('id');
            expect(newUser).toHaveProperty('username');
            expect(newUser).toHaveProperty('email');
            expect(newUser.password).toBeUndefined();
        });
    });

    describe('FIND ONE', () => {
        it('should fetch user by username or email', async () => {
            const newUser = await authServices.create(
                {
                    username: 'testuser1',
                    email: 'test@test.com',
                    password: 'testpassword1'
                },
                { password: 0 }
            );

            const foundUser = await authServices.findOne(
                {
                    $or: [{ username: newUser.username, email: newUser.email }]
                },
                { password: 0 }
            );

            expect(foundUser).not.toBeNull();
            expect(foundUser).not.toBeUndefined();

            expect(foundUser).toHaveProperty('id');
            expect(foundUser).toHaveProperty('username');
            expect(foundUser).toHaveProperty('email');
            expect(foundUser!.password).toBeUndefined();
        });
    });

    describe('FIND ONE BY ID', () => {
        it('should find a user by id only', async () => {
            const newUser = await authServices.create(
                {
                    username: 'testuser1',
                    email: 'test@test.com',
                    password: 'testpassword1'
                },
                { password: 0 }
            );

            const foundUser = await authServices.findById(newUser.id, {
                password: 0
            });

            expect(foundUser).not.toBeNull();
            expect(foundUser).not.toBeUndefined();

            expect(foundUser).toHaveProperty('id');
            expect(foundUser).toHaveProperty('username');
            expect(foundUser).toHaveProperty('email');
            expect(foundUser!.password).toBeUndefined();
        });
    });

    describe('UPDATE', () => {
        it('should find and update the user document', async () => {
            const newUser = await authServices.create(
                {
                    username: 'testuser1',
                    email: 'test@test.com',
                    password: 'testpassword1'
                },
                { password: 0 }
            );

            const updatedUser = await authServices.findByIdAndUpdate(
                newUser.id,
                {
                    username: 'updateuser1',
                    email: 'updateuser1@test.com',
                    password: 'updatepassword1'
                }
            );

            expect(updatedUser).not.toBeNull();
            expect(updatedUser).not.toBeUndefined();

            expect(updatedUser).toHaveProperty('id');
            expect(updatedUser).toHaveProperty('username');
            expect(updatedUser).toHaveProperty('email');
            expect(updatedUser).toHaveProperty('password');

            expect(updatedUser!.id).toEqual(newUser.id);
            expect(updatedUser!.username).not.toEqual(newUser.username);
            expect(updatedUser!.email).not.toEqual(newUser.email);
            expect(updatedUser!.password).not.toEqual(newUser.password);
        });
    });

    describe('DELETE', () => {
        it('should find and update the user document', async () => {
            const newUser = await authServices.create(
                {
                    username: 'testuser1',
                    email: 'test@test.com',
                    password: 'testpassword1'
                },
                { password: 0 }
            );

            const deletedUser = await authServices.findByIdAndDelete(
                newUser.id
            );

            expect(deletedUser).not.toBeNull();
            expect(deletedUser).not.toBeUndefined();
        });
    });

    afterAll(async () => {
        await conn.connection.dropCollection('auths');
        await conn.connection.dropDatabase();
        await connection.disconnectMongoDB();
    });
});
