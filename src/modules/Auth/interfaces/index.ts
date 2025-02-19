import { Document } from 'mongoose';

export interface IAuthModel extends Document {
    username: string;
    email: string;
    password: string;
}

export interface IAuthInfo {
    id: string;
    username: string;
    email: string;
}

export interface ISignupData {
    username: string;
    email: string;
    password: string;
}

export interface ILoginData {
    username?: string;
    email?: string;
    password: string;
}
