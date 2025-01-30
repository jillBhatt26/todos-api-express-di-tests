import { Router } from 'express';
import { container } from 'tsyringe';
import TodosController from '../controller';

const router: Router = Router();
const todosController = container.resolve(TodosController);

router.get('/', todosController.fetchTodosAll);

router.post('/', todosController.createTodo);

router.get('/:id', todosController.fetchTodoByID);

router.put('/:id', todosController.updateTodo);

router.delete('/:id', todosController.deleteTodo);

export { router as TodoRouter };
