
# Express TypeScript Dependency Injection

Harness the flexibility of express.js with the power and structure of nest.js to build scalable APIs by implementing dependency injection.


## Tech Stack

**Node, Express**

**TypeScript**

**MongoDB with Mongoose**

**Tsyringe**

**Swagger Docs**

**Jest Unit testing**

**Supertest e2e testing**


## Features

- Express TypeScript
- Class components for services and controllers
- Injectable Databse Services and Models
- Demonstration of classes usage by dependency injection
- Jest unit and Supertest e2e tests
- GitHub Actions Workflow for testing and release
- Path aliasing for development, test and production environments.
- Swagger documentation for manual API testing
## Documentation

[Documentation](https://linktodocumentation)


## Usage

Git clone the repo

```bash
  git clone https://github.com/jillBhatt26/todos-api-express-di-tests.git
```

cd into the repo

```bash
  cd todos-api-express-di-tests
```

Install all dependencies

```bash
  yarn install --frozen-lockfile
```

Make a .env file in the root and populate with variables mentioned below

```bash
  touch .env
```

Start dev server

```bash
  yarn dev
```

Start dev server + automatic testing on reload

```bash
  yarn dev:test
```

Generate build

```bash
  yarn build
```

Start production build

```bash
  yarn prod
```
    
## Environment Variables

`NODE_ENV = development`

`PORT = 5000`

`DB_URL = <MY_DB_URL>`

`TEST_DB_URL = <MY_TEST_DB_URL>`

`FE_URL = <MY_FE_URL>`

`SESSION_SECRET = <MY_SECRET>`
