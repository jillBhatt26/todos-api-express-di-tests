/** @type {import('ts-jest').JestConfigWithTsJest} **/
// const { pathsToModuleNameMapper } = require('ts-jest');
// const { compilerOptions } = require('./tsconfig.json');

module.exports = {
    testEnvironment: 'node',
    transform: {
        '^.+.tsx?$': ['ts-jest', {}]
    },
    clearMocks: true,
    verbose: true,
    preset: 'ts-jest',
    moduleFileExtensions: ['ts', 'js', 'json'],
    moduleDirectories: ['node_modules', 'src'],
    modulePathIgnorePatterns: ['<rootDir>/dist', '<rootDir>/dist'],
    // moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    //     prefix: 'src'
    // })
    moduleNameMapper: {
        '^@app': '<rootDir>/src/app/$1',
        '^@config': '<rootDir>/src/config/$1',
        '^@constants': '<rootDir>/src/constants/$1',
        '^@db/(.*)': '<rootDir>/src/db/$1',
        '^@interfaces': '<rootDir>/src/interfaces/$1',
        '^@middleware/(.*)': '<rootDir>/src/middleware/$1',
        '^@modules/(.*)': '<rootDir>/src/modules/$1',
        '^@router': '<rootDir>/src/router/$1'
    }
};
