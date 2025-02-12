import path from 'path';
import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Todo API Docs',
            version: '1.0.0'
        },
        servers: [
            {
                url: 'http://localhost:5000'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            }
        }
    },
    apis: [path.resolve(__dirname, '../', '../', 'router', 'index.[jt]s?')]
};

const swaggerJsDocSpecs = swaggerJsdoc(options);

export default swaggerJsDocSpecs;
