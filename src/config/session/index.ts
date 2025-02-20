import MongoStore from 'connect-mongo';
import { DB_URL, NODE_ENV, SESSION_SECRET, TEST_DB_URL } from '@config/env';
import session from 'express-session';

const initAppSession = () => {
    let mongoUrl = DB_URL;

    if (NODE_ENV === 'test') mongoUrl = TEST_DB_URL;

    const mongoStore = MongoStore.create({
        mongoUrl,
        collectionName: 'sessions'
    });

    const appSession = session({
        secret: SESSION_SECRET,
        resave: true,
        saveUninitialized: false,
        store: mongoStore
    });

    return appSession;
};

export default initAppSession;
