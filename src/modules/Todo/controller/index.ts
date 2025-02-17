import { NextFunction, Request, Response } from 'express';
import { singleton, autoInjectable, container, inject } from 'tsyringe';
import TodosServices from '../services';
import { ITodo } from '../interfaces';
import AuthServices from '@modules/Auth/services';

@singleton()
@autoInjectable()
class TodosController {
    constructor(
        private todosService: TodosServices,
        @inject(AuthServices) private readonly authService: AuthServices
    ) {}

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

            if (!name || !description) {
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

            const taskToUpdate: ITodo | null = await this.todosService.findById(
                taskID
            );

            if (!taskToUpdate)
                return next({
                    code: 400,
                    message: 'Task to update not found!'
                });

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

            const taskToDelete: ITodo | null = await this.todosService.findById(
                taskID
            );

            if (!taskToDelete) {
                return next({
                    code: 400,
                    message: 'Task to delete not found!'
                });
            }

            const deletedTodo: ITodo | null =
                await this.todosService.findByIdAndDelete(taskID);

            return res.status(200).json({
                success: true,
                data: {
                    deletedTodo
                }
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

const todosController = container.resolve(TodosController);

export default todosController;
