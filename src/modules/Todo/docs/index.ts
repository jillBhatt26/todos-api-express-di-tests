// /**
//  * @swagger
//  *      /data:
//  *          get:
//  *              summary: Fetches all the data
//  *              tags: [Data]
//  *              responses:
//  *                  200:
//  *                      description: Returns an array of all the data in the data key of the response object
//  *                      content:
//  *                          application/json:
//  *                              schema:
//  *                                  type: object
//  *                                  $ref: '#/components/schemas/ServerResponseSuccess'
//  *
//  *                  500:
//  *                      description: Internal server error
//  *                      content:
//  *                          application/json:
//  *                              schema:
//  *                                  type: object
//  *                                  $ref: '#/components/schemas/ServerResponseFailure'
//  *
//  */

// /**
//  * @swagger
//  *      /data:
//  *          post:
//  *              summary: Creates new data
//  *              tags: [Data]
//  *              requestBody:
//  *                  required: true
//  *                  content:
//  *                      application/json:
//  *                          schema:
//  *                              type: array
//  *                              $ref: '#/components/schemas/CreateData'
//  *
//  *              responses:
//  *                  200:
//  *                      description: The updated data array
//  *                      content:
//  *                          application/json:
//  *                              schema:
//  *                                  type: object
//  *                                  $ref: '#/components/schemas/ServerResponseSuccess'
//  *
//  *                  400:
//  *                      description: Invalid request body provided
//  *                      content:
//  *                          application/json:
//  *                              schema:
//  *                                  type: object
//  *                                  $ref: '#/components/schemas/ServerResponseFailure'
//  *
//  *                  500:
//  *                      description: Internal server error
//  *                      content:
//  *                          application/json:
//  *                              schema:
//  *                                  type: object
//  *                                  $ref: '#/components/schemas/ServerResponseFailure'
//  */

// /**
//  * @swagger
//  *      /data/{id}:
//  *          get:
//  *              summary: Finds the data of the id provided
//  *              tags: [Data]
//  *
//  *              parameters:
//  *                  - in: path
//  *                    name: id
//  *                    schema:
//  *                      type: string
//  *                    required: true
//  *                    description: The id of the data to be fetched
//  *
//  *              responses:
//  *                  200:
//  *                      description: The fetched data
//  *                      content:
//  *                          application/json:
//  *                              schema:
//  *                                  type: object
//  *                                  $ref: '#/components/schemas/ServerResponseSuccess'
//  *
//  *                  404:
//  *                      description: Data to fetch not found
//  *                      content:
//  *                          application/json:
//  *                              schema:
//  *                                  type: object
//  *                                  $ref: '#/components/schemas/ServerResponseFailure'
//  *
//  *                  500:
//  *                      description: Internal server error
//  *                      content:
//  *                          application/json:
//  *                              schema:
//  *                                  type: object
//  *                                  $ref: '#/components/schemas/ServerResponseFailure'
//  */

// /**
//  * @swagger
//  *      /data/{id}:
//  *          put:
//  *              summary: Finds and updates the required data
//  *              tags: [Data]
//  *
//  *              parameters:
//  *                  - in: path
//  *                    name: id
//  *                    schema:
//  *                      type: string
//  *                    required: true
//  *                    description: The id of the data to be deleted
//  *
//  *              requestBody:
//  *                  required: true
//  *                  content:
//  *                      application/json:
//  *                          schema:
//  *                              type: array
//  *                              $ref: '#/components/schemas/UpdateData'
//  *
//  *              responses:
//  *                  200:
//  *                      description: The updated data
//  *                      content:
//  *                          application/json:
//  *                              schema:
//  *                                  type: object
//  *                                  $ref: '#/components/schemas/Data'
//  *
//  *                  400:
//  *                      description: Invalid request body provided
//  *                      content:
//  *                          application/json:
//  *                              schema:
//  *                                  type: object
//  *                                  $ref: '#/components/schemas/ServerResponseFailure'
//  *
//  *                  404:
//  *                      description: Data to update not found
//  *                      content:
//  *                          application/json:
//  *                              schema:
//  *                                  type: object
//  *                                  $ref: '#/components/schemas/ServerResponseFailure'
//  *
//  *                  500:
//  *                      description: Internal server error
//  *                      content:
//  *                          application/json:
//  *                              schema:
//  *                                  type: object
//  *                                  $ref: '#/components/schemas/ServerResponseFailure'
//  */

// /**
//  * @swagger
//  *      /data/{id}:
//  *          delete:
//  *              summary: Finds and deletes the required data
//  *              tags: [Data]
//  *
//  *              parameters:
//  *                  - in: path
//  *                    name: id
//  *                    schema:
//  *                      type: string
//  *                    required: true
//  *                    description: The id of the data to be deleted
//  *
//  *              responses:
//  *                  200:
//  *                      description: Delete data confirmation
//  *                      content:
//  *                          application/json:
//  *                              schema:
//  *                                  type: object
//  *                                  $ref: '#/components/schemas/ServerResponseSuccess'
//  *
//  *                  404:
//  *                      description: Data to delete not found
//  *                      content:
//  *                          application/json:
//  *                              schema:
//  *                                  type: object
//  *                                  $ref: '#/components/schemas/ServerResponseFailure'
//  *
//  *                  500:
//  *                      description: Internal server error
//  *                      content:
//  *                          application/json:
//  *                              schema:
//  *                                  type: object
//  *                                  $ref: '#/components/schemas/ServerResponseFailure'
//  */

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
 *              required:
 *                  - success
 */

// **********************
// ROUTES
// **********************

/**
 * @swagger
 * tags:
 *      name: Info
 *      description: Health check route
 *
 * /info:
 *   get:
 *     summary: Returns os information
 *     tags: [Info]
 *     responses:
 *       200:
 *         description: A successful response
 */

/**
 * @swagger
 * tags:
 *      name: Todos
 *      description: API to manage todos
 */
