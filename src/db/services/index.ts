import {
    Document,
    Model,
    MongooseError,
    ProjectionType,
    RootFilterQuery
} from 'mongoose';
import { IDBModel } from '@interfaces';

class DBServices<T extends Document> {
    model: Model<T>;

    constructor(private dbModel: IDBModel<T>) {
        this.model = this.dbModel.model;
    }

    find = async (
        query?: RootFilterQuery<Record<keyof T, any>>
    ): Promise<T[]> => {
        try {
            const data: T[] = await this.model.find({
                ...query
            });

            return data;
        } catch (error: unknown) {
            if (error instanceof MongooseError) {
                throw new Error(error.message);
            }

            throw new Error('Failed to find the data!');
        }
    };

    findOne = async (
        query?: RootFilterQuery<Record<keyof T, any>>,
        projection?: ProjectionType<Record<keyof T, any>> | null
    ): Promise<T | null> => {
        try {
            const data: T | null = await this.model.findOne(
                {
                    ...query
                },
                projection
            );

            return data;
        } catch (error: unknown) {
            if (error instanceof MongooseError) {
                throw new Error(error.message);
            }

            throw new Error('Failed to find the data!');
        }
    };

    findById = async (
        resourceId: string,
        projection?: ProjectionType<Record<keyof T, any>> | null
    ): Promise<T | null> => {
        try {
            const data: T | null = await this.model.findById(
                resourceId,
                projection
            );

            return data;
        } catch (error: unknown) {
            if (error instanceof MongooseError) {
                throw new Error(error.message);
            }

            throw new Error('Failed to find the data!');
        }
    };

    create = async (
        createResourceData: Partial<T>,
        projection?: ProjectionType<Record<keyof T, any>> | null
    ): Promise<T> => {
        try {
            const createdData: T = await this.model.create(createResourceData);
            const data: T | null = await this.model.findById(
                createdData.id,
                projection
            );

            if (!data) {
                throw new Error('Failed to retrieve created data!');
            }

            return data;
        } catch (error: unknown) {
            if (error instanceof MongooseError) {
                throw new Error(error.message);
            }

            throw new Error('Failed to create data!');
        }
    };
    // create = async (
    //     createResourceData: Partial<T>,
    //     projection?: ProjectionType<Record<keyof T, any>> | null
    // ): Promise<T> => {
    //     try {
    //         const data: T = await this.model.create(createResourceData);

    //         return data;
    //     } catch (error: unknown) {
    //         if (error instanceof MongooseError) {
    //             throw new Error(error.message);
    //         }

    //         throw new Error('Failed to create data!');
    //     }
    // };

    insertMany = async (createResourceDataArray: Partial<T>[]) => {
        try {
            const data = await this.model.insertMany(createResourceDataArray);

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
        updateResourceData: Partial<T>,
        projection?: ProjectionType<Record<keyof T, any>> | null
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

            if (data && projection) {
                const projectionData: T | null = await this.model.findById(
                    resourceId,
                    projection
                );

                return projectionData;
            }

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

    deleteAll = async (): Promise<boolean> => {
        try {
            await this.model.deleteMany({});

            return true;
        } catch (error: unknown) {
            if (error instanceof MongooseError) {
                throw new Error(error.message);
            }

            throw new Error('Failed to delete data!');
        }
    };
}

export default DBServices;
