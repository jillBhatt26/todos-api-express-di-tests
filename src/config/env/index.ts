import 'dotenv/config';

const NODE_ENV = process.env.NODE_ENV ?? 'development';
const PORT = parseInt(process.env.PORT!) ?? 5000;
const DB_URL = process.env.DB_URL ?? '';
const TEST_DB_URL = process.env.TEST_DB_URL ?? '';
const FE_URL = process.env.FE_URL ?? '';
const HOST = process.env.RENDER_HOST ?? 'localhost';

export { NODE_ENV, HOST, PORT, DB_URL, TEST_DB_URL, FE_URL };
