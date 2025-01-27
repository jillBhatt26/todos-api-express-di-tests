import { Router } from 'express';
import {
    fetchTodo,
    fetchTodosAll,
    createTodo,
    updateTodo,
    deleteTodo
} from '../controller';

const router: Router = Router();

router.get('/', fetchTodosAll);

router.get('/:id', fetchTodo);

router.post('/', createTodo);

router.put('/:id', updateTodo);

router.delete('/:id', deleteTodo);

export { router as TodoRouter };
