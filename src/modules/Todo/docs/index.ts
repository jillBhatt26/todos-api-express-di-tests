// **********************
// ENUMS
// **********************

/**
 * @swagger
 * components:
 *      schemas:
 *          TodoStatus:
 *              type: string
 *              enum:
 *                  - pending
 *                  - progress
 *                  - completed
 */

// **********************
// DATA TYPES
// **********************

/**
 * @swagger
 * components:
 *      schemas:
 *          Todo:
 *              type: object
 *              required:
 *                  - id
 *                  - name
 *                  - description
 *                  - status
 *              properties:
 *                  id:
 *                      type: string
 *                      description: Auto generated id of todo
 *
 *                  name:
 *                      type: string
 *                      description: Name of the todo
 *
 *                  description:
 *                      type: string
 *                      description: Description of the todo
 *
 *                  status:
 *                      type: string
 *                      description: Status of the todo
 *                      $ref: "#/components/schemas/TodoStatus"
 *
 *              example:
 *                  id: asdf
 *                  name: New task 1
 *                  content: New task 1 description
 *                  status: pending
 *
 *          CreateTodo:
 *              type: object
 *
 *              properties:
 *                  name:
 *                      type: string
 *                      description: Name of the todo to be created
 *
 *                  description:
 *                      type: string
 *                      description: Description of the todo to be created
 *
 *                  status:
 *                      type: string
 *                      description: Status of the todo to be created
 *                      $ref: '#/components/schemas/TodoStatus'
 *
 *              required:
 *                  - name
 *                  - description
 *
 *              example:
 *                  name: Todo 1 name
 *                  description: Todo 1 description
 *
 *          UpdateTodo:
 *              type: object
 *
 *              properties:
 *                  name:
 *                      type: string
 *                      description: Name of the todo to be created
 *
 *                  description:
 *                      type: string
 *                      description: Description of the todo to be created
 *
 *                  status:
 *                      type: string
 *                      description: Status of the todo to be created
 *                      $ref: '#/components/schemas/TodoStatus'
 *
 *              example:
 *                  name: Updated Todo 1 name
 *                  description: Updated Todo 1 description
 *                  status: progress
 */

/**
 * @swagger
 * components:
 *      schemas:
 *          TodosArray:
 *              type: array
 *              items:
 *                  $ref: '#/components/schemas/Todo'
 */

/**
 * @swagger
 * components:
 *      schemas:
 *          ServerResponseSuccess:
 *              type: object
 *
 *              description: The response object of the API
 *
 *              properties:
 *                  success:
 *                      type: boolean
 *                      description: Completion status of the API
 *
 *                  data:
 *                      type: object
 *                      oneOf:
 *                          todos:
 *                              $ref: '#/components/schemas/TodosArray'
 *
 *                          todo:
 *                              $ref: '#/components/schemas/Todo'
 *
 *                          newTask:
 *                              $ref: '#/components/schemas/Todo'
 *
 *                          updatedTask:
 *                              $ref: '#/components/schemas/Todo'
 *
 *                          deletedTask:
 *                              $ref: '#/components/schemas/Todo'
 *
 *              example:
 *                  success: true
 *                  task:
 *                      id: 67b0d5a85ad87a9b5b3e6662
 *                      name: Name of Todo
 *                      description: Description of Todo
 *                      status: pending / progress / completed
 *
 *              required:
 *                  - success
 *
 *          ServerResponseFailure:
 *              type: object
 *
 *              description: The response object of the API
 *
 *              properties:
 *                  success:
 *                      type: boolean
 *                      description: Completion status of the API
 *
 *                  error:
 *                      type: string
 *                      description: Failure reason
 *
 *              example:
 *                  success: false
 *                  error: Something went wrong!
 *
 *              required:
 *                  - success
 */

// **********************
// TAGS
// **********************

/**
 * @swagger
 *  tags:
 *      name: Info
 *      description: Health check and project info route
 *
 * @swagger
 *  tags:
 *      name: Todos
 *      description: APIs to manage Todos
 */

// **********************
// ROUTES
// **********************

/**
 * @swagger
 *
 * /info:
 *   get:
 *     summary: Returns os information
 *     tags: [Info]
 *
 *     responses:
 *       200:
 *         description: A successful response
 */

/**
 * @swagger
 *      /todos:
 *          get:
 *              summary: Fetches all the todos
 *              tags: [Todos]
 *
 *              security:
 *                  - sessionAuth: []
 *
 *              responses:
 *                  200:
 *                      description: Returns an array of all the todos
 *                      content:
 *                          application/json:
 *                              schema:
 *                                  type: object
 *                                  $ref: '#/components/schemas/ServerResponseSuccess'
 *
 *                  500:
 *                      description: Internal server error
 *                      content:
 *                          application/json:
 *                              schema:
 *                                  type: object
 *                                  $ref: '#/components/schemas/ServerResponseFailure'
 *
 *          post:
 *              summary: Creates new todo
 *              tags: [Todos]
 *
 *              security:
 *                  - sessionAuth: []
 *
 *              requestBody:
 *                  required: true
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              $ref: '#/components/schemas/CreateTodo'
 *
 *              responses:
 *                  200:
 *                      description: The newly created Todo object
 *                      content:
 *                          application/json:
 *                              schema:
 *                                  type: object
 *                                  $ref: '#/components/schemas/ServerResponseSuccess'
 *
 *                  400:
 *                      description: Invalid request body provided
 *                      content:
 *                          application/json:
 *                              schema:
 *                                  type: object
 *                                  $ref: '#/components/schemas/ServerResponseFailure'
 *
 *                  500:
 *                      description: Internal server error
 *                      content:
 *                          application/json:
 *                              schema:
 *                                  type: object
 *                                  $ref: '#/components/schemas/ServerResponseFailure'
 */

/**
 * @swagger
 *      /todos/{id}:
 *          get:
 *              summary: Finds the Todo using the id provided
 *              tags: [Todos]
 * 
 *              security:
 *                  - sessionAuth: []
 *
 *
 *              parameters:
 *                  - in: path
 *                    name: id
 *                    schema:
 *                      type: string
 *                    required: true
 *                    description: The id of the Todo to be fetched
 *
 *              responses:
 *                  200:
 *                      description: The fetched Todo
 *                      content:
 *                          application/json:
 *                              schema:
 *                                  type: object
 *                                  $ref: '#/components/schemas/ServerResponseSuccess'
 *
 *                  404:
 *                      description: Todo to fetch not found
 *                      content:
 *                          application/json:
 *                              schema:
 *                                  type: object
 *                                  $ref: '#/components/schemas/ServerResponseFailure'
 *
 *                  500:
 *                      description: Internal server error
 *                      content:
 *                          application/json:
 *                              schema:
 *                                  type: object
 *                                  $ref: '#/components/schemas/ServerResponseFailure'

 *          put:
 *              summary: Finds and updates the required Todo
 *              tags: [Todos]
 * 
 *              security:
 *                  - sessionAuth: []
 *
 *
 *              parameters:
 *                  - in: path
 *                    name: id
 *                    schema:
 *                      type: string
 *                    required: true
 *                    description: The id of the Todo to be updated
 *
 *              requestBody:
 *                  required: true
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: array
 *                              $ref: '#/components/schemas/UpdateTodo'
 *
 *              responses:
 *                  200:
 *                      description: The updated Todo
 *                      content:
 *                          application/json:
 *                              schema:
 *                                  type: object
 *                                  $ref: '#/components/schemas/Todo'
 *
 *                  400:
 *                      description: Invalid request body provided
 *                      content:
 *                          application/json:
 *                              schema:
 *                                  type: object
 *                                  $ref: '#/components/schemas/ServerResponseFailure'
 *
 *                  404:
 *                      description: Todo to update not found
 *                      content:
 *                          application/json:
 *                              schema:
 *                                  type: object
 *                                  $ref: '#/components/schemas/ServerResponseFailure'
 *
 *                  500:
 *                      description: Internal server error
 *                      content:
 *                          application/json:
 *                              schema:
 *                                  type: object
 *                                  $ref: '#/components/schemas/ServerResponseFailure'
 * 
 *          delete:
 *              summary: Finds and deletes the required Todo
 *              tags: [Todos]
 * 
 *              security:
 *                  - sessionAuth: []
 *
 *              parameters:
 *                  - in: path
 *                    name: id
 *                    schema:
 *                      type: string
 *                    required: true
 *                    description: The id of the Todo to be deleted
 *
 *              responses:
 *                  200:
 *                      description: Delete Todo confirmation
 *                      content:
 *                          application/json:
 *                              schema:
 *                                  type: object
 *                                  $ref: '#/components/schemas/ServerResponseSuccess'
 *
 *                  404:
 *                      description: Todo to delete not found
 *                      content:
 *                          application/json:
 *                              schema:
 *                                  type: object
 *                                  $ref: '#/components/schemas/ServerResponseFailure'
 *
 *                  500:
 *                      description: Internal server error
 *                      content:
 *                          application/json:
 *                              schema:
 *                                  type: object
 *                                  $ref: '#/components/schemas/ServerResponseFailure'
 */
