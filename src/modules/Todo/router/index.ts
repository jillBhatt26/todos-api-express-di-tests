import { Router } from 'express';
import authMiddleware from '@middleware/auth';
import todosController from '../controller';

const TodosRouter: Router = Router();

TodosRouter.get('/', authMiddleware.strict, todosController.fetchTodosAll);

TodosRouter.post('/', authMiddleware.strict, todosController.createTodo);

TodosRouter.get('/:id', authMiddleware.strict, todosController.fetchTodoByID);

TodosRouter.put('/:id', authMiddleware.strict, todosController.updateTodo);

TodosRouter.delete('/:id', authMiddleware.strict, todosController.deleteTodo);

export { TodosRouter };
