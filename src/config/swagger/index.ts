import swaggerJSDoc from 'swagger-jsdoc';
import { NODE_ENV, HOST, PORT } from '@config/env';

// swagger options
const options: swaggerJSDoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Todos API using Express, Typescript, MongoDB and DI',
            version: '1.0.0',
            description: 'A simple Express API to manage your tasks!'
        },
        schemes: ['http', 'https'],
        servers: [
            {
                url:
                    NODE_ENV === 'development'
                        ? `http://${HOST}:${PORT}/api`
                        : `https://${HOST}/api`
            }
        ]
    },
    apis: ['**/docs/**/*.{js,ts}']
};

const swaggerSpecs = swaggerJSDoc(options);

export default swaggerSpecs;
