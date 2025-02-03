import { MongooseError } from 'mongoose';
import { autoInjectable, singleton } from 'tsyringe';
import { ITodo, ICreateTodoData, IUpdateTodoData } from '../interfaces';
import Todos from '../model';

@singleton()
@autoInjectable()
class TodosServices {
    getTodosAll = async (): Promise<ITodo[]> => {
        try {
            const todos: ITodo[] = await Todos.find({});

            return todos;
        } catch (error: unknown) {
            if (error instanceof MongooseError) {
                throw new Error(error.message);
            }

            throw new Error('Failed to fetch all tasks!');
        }
    };

    getTodoById = async (todoID: string): Promise<ITodo> => {
        try {
            const todo: ITodo | null = await Todos.findById(todoID);

            if (!todo) throw new Error('No task found!');

            return todo;
        } catch (error: unknown) {
            if (error instanceof MongooseError) {
                throw new Error(error.message);
            }

            throw new Error('Failed to fetch task!');
        }
    };

    createNewTodo = async (createTodoData: ICreateTodoData): Promise<ITodo> => {
        try {
            const todo: ITodo = await Todos.create(createTodoData);

            return todo;
        } catch (error: unknown) {
            if (error instanceof MongooseError) {
                throw new Error(error.message);
            }

            throw new Error('Failed to create task!');
        }
    };

    updateTodo = async (
        id: string,
        updateTodoData: IUpdateTodoData
    ): Promise<ITodo> => {
        try {
            const todo: ITodo | null = await Todos.findByIdAndUpdate(
                id,
                {
                    $set: updateTodoData
                },
                { new: true }
            );

            if (!todo) throw new Error('Failed to update task!');

            return todo;
        } catch (error: unknown) {
            if (error instanceof MongooseError) {
                throw new Error(error.message);
            }

            throw new Error('Failed to update task!');
        }
    };

    deleteTodo = async (todoID: string): Promise<boolean> => {
        try {
            await Todos.findByIdAndDelete(todoID);

            return true;
        } catch (error: unknown) {
            if (error instanceof MongooseError) {
                throw new Error(error.message);
            }

            throw new Error('Failed to delete task!');
        }
    };
}

export default TodosServices;
