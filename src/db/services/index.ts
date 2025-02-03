import { Model, MongooseError } from 'mongoose';
import { IDBModel } from '@interfaces';

class DBServices<T> {
    model: Model<T>;

    constructor(private dbModel: IDBModel<T>) {
        this.model = this.dbModel.model;
    }

    find = async (): Promise<T[]> => {
        try {
            const data: T[] = await this.model.find({});

            return data;
        } catch (error: unknown) {
            if (error instanceof MongooseError) {
                throw new Error(error.message);
            }

            throw new Error('Failed to find the data!');
        }
    };

    findById = async (resourceId: string): Promise<T | null> => {
        try {
            const data: T | null = await this.model.findById(resourceId);

            return data;
        } catch (error: unknown) {
            if (error instanceof MongooseError) {
                throw new Error(error.message);
            }

            throw new Error('Failed to find the data!');
        }
    };

    create = async (createResourceData: Partial<T>): Promise<T> => {
        try {
            const data: T = await this.model.create(createResourceData);

            return data;
        } catch (error: unknown) {
            if (error instanceof MongooseError) {
                throw new Error(error.message);
            }

            throw new Error('Failed to create data!');
        }
    };

    findByIdAndUpdate = async (
        resourceId: string,
        updateResourceData: Partial<T>
    ): Promise<T | null> => {
        try {
            const data: T | null = await this.model.findByIdAndUpdate(
                resourceId,
                {
                    $set: updateResourceData
                },
                {
                    new: true
                }
            );

            return data;
        } catch (error: unknown) {
            if (error instanceof MongooseError) {
                throw new Error(error.message);
            }

            throw new Error('Failed to update data!');
        }
    };

    findByIdAndDelete = async (resourceId: string): Promise<T | null> => {
        try {
            const data: T | null = await this.model.findByIdAndDelete(
                resourceId
            );

            return data;
        } catch (error: unknown) {
            if (error instanceof MongooseError) {
                throw new Error(error.message);
            }

            throw new Error('Failed to delete data!');
        }
    };
}

export default DBServices;
