import { NextFunction, Request, Response } from 'express';
import { singleton, injectable, inject, autoInjectable } from 'tsyringe';
import TodosServices from '../services';
import { ITodo } from '../interfaces';

@singleton()
@injectable()
@autoInjectable()
class TodosController {
    constructor(@inject(TodosServices) private todosService: TodosServices) {}

    public fetchTodosAll = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const tasks: ITodo[] = await this.todosService.getTodosAll();

            return res.status(200).json({
                success: true,
                data: {
                    tasks
                }
            });
        } catch (error: unknown) {
            if (error instanceof Error) {
                return next({
                    code: 500,
                    message: error.message ?? 'Failed to fetch all tasks!'
                });
            }

            return next({
                code: 500,
                message: 'Failed to fetch all tasks!'
            });
        }
    };

    async fetchTodoByID(req: Request, res: Response, next: NextFunction) {
        try {
            const taskID: string | undefined = req.params.id;

            if (!taskID) {
                return next({
                    code: 400,
                    message: 'Task id not provided!'
                });
            }

            const task: ITodo | null = await this.todosService.getTodoById(
                taskID
            );

            if (!task) {
                return next({
                    code: 400,
                    message: 'Task not found!'
                });
            }

            return res.status(200).json({
                success: true,
                data: {
                    task
                }
            });
        } catch (error: unknown) {
            if (error instanceof Error) {
                return next({
                    code: 500,
                    message:
                        error.message ?? 'Failed to fetch the required task!'
                });
            }

            return next({
                code: 500,
                message: 'Failed to fetch the required task!'
            });
        }
    }

    async createTodo(req: Request, res: Response, next: NextFunction) {
        try {
            const { name, description, status } = req.body;

            if (!name || !description || !status) {
                return next({
                    code: 400,
                    message: 'Please provide all task details'
                });
            }

            const newTask: ITodo = await this.todosService.createNewTodo({
                name,
                description,
                status
            });

            return res.status(201).json({
                success: true,
                data: {
                    newTask
                }
            });
        } catch (error: unknown) {
            if (error instanceof Error) {
                return next({
                    code: 500,
                    message: error.message ?? 'Failed to create new task!'
                });
            }

            return next({
                code: 500,
                message: 'Failed to create new task!'
            });
        }
    }

    async updateTodo(req: Request, res: Response, next: NextFunction) {
        try {
            const taskID: string | undefined = req.params.id;

            if (!taskID) {
                return next({
                    code: 400,
                    message: 'Task id not provided!'
                });
            }

            const { name, description, status } = req.body;

            const updatedTask: ITodo | null =
                await this.todosService.updateTodo(taskID, {
                    name,
                    description,
                    status
                });

            return res.status(200).json({
                success: true,
                data: {
                    updatedTask
                }
            });
        } catch (error: unknown) {
            if (error instanceof Error) {
                return next({
                    code: 500,
                    message: error.message ?? 'Failed to update the task!'
                });
            }

            return next({
                code: 500,
                message: 'Failed to update the task!'
            });
        }
    }

    async deleteTodo(req: Request, res: Response, next: NextFunction) {
        try {
            const taskID: string | undefined = req.params.id;

            if (!taskID) {
                return next({
                    code: 400,
                    message: 'Task id not provided!'
                });
            }

            await this.todosService.deleteTodo(taskID);

            return res.status(200).json({
                success: true
            });
        } catch (error: unknown) {
            if (error instanceof Error) {
                return next({
                    code: 500,
                    message: error.message ?? 'Failed to delete the task!'
                });
            }

            return next({
                code: 500,
                message: 'Failed to delete the task!'
            });
        }
    }
}

export default TodosController;
