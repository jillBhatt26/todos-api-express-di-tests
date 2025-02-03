import { Router } from 'express';
import { container } from 'tsyringe';
import todosController from '../controller';

const router: Router = Router();

router.get('/', todosController.fetchTodosAll);

router.post('/', todosController.createTodo);

router.get('/:id', todosController.fetchTodoByID);

router.put('/:id', todosController.updateTodo);

router.delete('/:id', todosController.deleteTodo);

export { router as TodoRouter };
