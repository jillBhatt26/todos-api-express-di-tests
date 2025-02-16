import { autoInjectable, singleton } from 'tsyringe';
import { hash, verify } from 'argon2';
import { ICustomError } from '@interfaces';

@autoInjectable()
@singleton()
class PasswordUtils {
    hash = async (inputPassword: string): Promise<string> => {
        try {
            const hashedPassword = await hash(inputPassword, {
                timeCost: 4,
                memoryCost: 1024,
                parallelism: 1,
                hashLength: 32
            });

            return hashedPassword;
        } catch (error: unknown) {
            const hashingError: ICustomError = {
                code: 500,
                message: 'Failed to hash the password!'
            };

            throw hashingError;
        }
    };

    verify = async (
        inputPassword: string,
        hashedPassword: string
    ): Promise<boolean> => {
        try {
            const isPasswordCorrect = await verify(
                hashedPassword,
                inputPassword
            );

            return isPasswordCorrect;
        } catch (error: unknown) {
            const hashingError: ICustomError = {
                code: 500,
                message: 'Failed to verify the password!'
            };

            throw hashingError;
        }
    };
}

export default PasswordUtils;
