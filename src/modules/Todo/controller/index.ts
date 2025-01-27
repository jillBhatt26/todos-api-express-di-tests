import { NextFunction, Request, Response } from 'express';
import Todos from '../model';
import { ITodo } from '../interfaces';

const fetchTodosAll = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const tasks: ITodo[] = await Todos.find({});

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

const fetchTodo = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const taskID: string | undefined = req.params.id;

        if (!taskID) {
            return next({
                code: 400,
                message: 'Task id not provided!'
            });
        }

        const task: ITodo | null = await Todos.findById(taskID);

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
                message: error.message ?? 'Failed to fetch the required task!'
            });
        }

        return next({
            code: 500,
            message: 'Failed to fetch the required task!'
        });
    }
};

const createTodo = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, description, status } = req.body;

        if (!name || !description || !status) {
            return next({
                code: 400,
                message: 'Please provide all task details'
            });
        }

        const newTask: ITodo = await Todos.create({
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

const updateTodo = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const taskID: string | undefined = req.params.id;

        if (!taskID) {
            return next({
                code: 400,
                message: 'Task id not provided!'
            });
        }

        const { name, description, status } = req.body;

        const updatedTask: ITodo | null = await Todos.findByIdAndUpdate(
            taskID,
            {
                $set: {
                    name,
                    description,
                    status
                }
            },
            {
                new: true
            }
        );

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

const deleteTodo = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const taskID: string | undefined = req.params.id;

        if (!taskID) {
            return next({
                code: 400,
                message: 'Task id not provided!'
            });
        }

        await Todos.findByIdAndDelete(taskID);

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

export { fetchTodo, fetchTodosAll, createTodo, updateTodo, deleteTodo };
