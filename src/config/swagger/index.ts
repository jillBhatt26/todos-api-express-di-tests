import swaggerJSDoc from 'swagger-jsdoc';
import { NODE_ENV, HOST, PORT } from '@config/env';

// swagger options
const options: swaggerJSDoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Dependency Injection in Express.js (TypeScript)',
            version: '1.0.0',
            description:
                'Harness the flexibility of express.js with the power and structure of nest.js to build scalable APIs by implementing dependency injection.'
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
