import { Router } from 'express';
import authMiddleware from '@middleware/auth';
import authControllers from '../controllers';

const authRouter: Router = Router();

authRouter.get('/', authMiddleware.strict, authControllers.fetchActiveUser);
authRouter.put('/', authMiddleware.strict, authControllers.updateUser);
authRouter.delete('/', authMiddleware.strict, authControllers.deleteUser);

authRouter.post('/signup', authMiddleware.strict, authControllers.signup);
authRouter.post('/login', authMiddleware.strict, authControllers.login);
authRouter.post('/logout', authMiddleware.strict, authControllers.logout);

export default authRouter;
