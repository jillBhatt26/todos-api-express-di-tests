import 'dotenv/config';

const NODE_ENV = process.env.NODE_ENV ?? 'development';
const PORT = parseInt(process.env.PORT!) ?? 5000;
const DB_URL = process.env.DB_URL ?? '';
const FE_URL = process.env.FE_URL ?? '';

export { NODE_ENV, PORT, DB_URL, FE_URL };
