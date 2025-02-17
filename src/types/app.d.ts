import session, { SessionData } from 'express-session';

declare module 'express-session' {
    interface SessionData {
        userID: string;
        username: string;
    }
}
