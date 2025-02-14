import swaggerJSDoc from 'swagger-jsdoc';
import { NODE_ENV, HOST, PORT } from '@config/env';

// swagger options
const options: swaggerJSDoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Swagger Express API',
            version: '1.0.0',
            description: 'A simple Express API with Swagger documentation'
        },
        schemes: ['http', 'https'],
        servers: [
            {
                url:
                    NODE_ENV === 'development'
                        ? `http://${HOST}:${PORT}`
                        : `https://${HOST}`
            }
        ]
    },
    apis: ['**/docs/**/*.{js,ts}']
};

const swaggerSpecs = swaggerJSDoc(options);

export default swaggerSpecs;
