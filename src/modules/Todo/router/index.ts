import { Router } from 'express';
import todosController from '../controller';

const TodosRouter: Router = Router();

TodosRouter.get('/', todosController.fetchTodosAll);

TodosRouter.post('/', todosController.createTodo);

TodosRouter.get('/:id', todosController.fetchTodoByID);

TodosRouter.put('/:id', todosController.updateTodo);

TodosRouter.delete('/:id', todosController.deleteTodo);

export { TodosRouter };
