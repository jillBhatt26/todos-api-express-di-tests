import 'reflect-metadata';
import { container } from 'tsyringe';
import PasswordUtils from '..';

describe('PASSWORD UTILS TESTS', () => {
    const passwordUtils = container.resolve(PasswordUtils);

    describe('HASH PASSWORD', () => {
        let password: string = 'SomethingToKeepSecret';
        let passwordHash: string;
        let anotherPasswordHash: string;

        it('should generate a hash for a password', async () => {
            passwordHash = await passwordUtils.hash(password);

            expect(passwordHash).not.toEqual(password);
        });

        it('should generate a another hash for same same password', async () => {
            anotherPasswordHash = await passwordUtils.hash(password);

            expect(anotherPasswordHash).not.toEqual(password);
        });

        it('should generate unique hashes each time', async () => {
            expect(anotherPasswordHash).not.toEqual(passwordHash);
        });
    });

    describe('VERIFY PASSWORD', () => {
        let password: string = 'SomethingToKeepSecret';
        let correctPassword: string = password;
        let inCorrectPassword: string = `password`;
        let passwordHash: string;

        it('Should verify the password', async () => {
            passwordHash = await passwordUtils.hash(password);

            const passwordShouldBeCorrect = await passwordUtils.verify(
                passwordHash,
                correctPassword
            );

            const passwordShouldBeIncorrect = await passwordUtils.verify(
                passwordHash,
                inCorrectPassword
            );

            expect(passwordShouldBeCorrect).toBe(true);
            expect(passwordShouldBeIncorrect).not.toBe(true);
        });
    });
});
