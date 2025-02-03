import { NextFunction, Request, Response } from 'express';
import { singleton, autoInjectable } from 'tsyringe';
import TodosServices from '../services';
import { ITodo } from '../interfaces';

@singleton()
@autoInjectable()
class TodosController {
    constructor(private todosService: TodosServices) {}

    public fetchTodosAll = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const tasks: ITodo[] = await this.todosService.find();

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

    fetchTodoByID = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const taskID: string | undefined = req.params.id;

            if (!taskID) {
                return next({
                    code: 400,
                    message: 'Task id not provided!'
                });
            }

            const task: ITodo | null = await this.todosService.findById(taskID);

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
    };

    createTodo = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { name, description, status } = req.body;

            if (!name || !description || !status) {
                return next({
                    code: 400,
                    message: 'Please provide all task details'
                });
            }

            const newTask: ITodo = await this.todosService.create({
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
    };

    updateTodo = async (req: Request, res: Response, next: NextFunction) => {
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
                await this.todosService.findByIdAndUpdate(taskID, {
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
    };

    deleteTodo = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const taskID: string | undefined = req.params.id;

            if (!taskID) {
                return next({
                    code: 400,
                    message: 'Task id not provided!'
                });
            }

            await this.todosService.findByIdAndDelete(taskID);

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
    };
}

export default TodosController;
