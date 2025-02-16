import { Router } from 'express';
import authControllers from '../controllers';

const authRouter: Router = Router();

authRouter.get('/', authControllers.fetchActiveUser);
authRouter.put('/', authControllers.updateUser);
authRouter.delete('/', authControllers.deleteUser);

authRouter.post('/signup', authControllers.signup);
authRouter.post('/login', authControllers.login);
authRouter.post('/logout', authControllers.logout);

export default authRouter;
