/**
 * @swagger
 * components:
 *      schemas:
 *          Data:
 *              type: object
 *              required:
 *                  - id
 *                  - name
 *                  - content
 *              properties:
 *                  id:
 *                      type: number
 *                      description: Auto generated id of data
 *
 *                  name:
 *                      type: string
 *                      description: Name of the data object
 *
 *                  content:
 *                      type: string
 *                      description: Content of the data object
 *
 *              example:
 *                  id: 1
 *                  name: Name of the data
 *                  content: Content of the data
 *
 *          CreateData:
 *              type: object
 *              required:
 *                  - name
 *                  - content
 *
 *              properties:
 *                  name:
 *                      type: string
 *                      description: Name of the data to be created
 *                  content:
 *                      type: string
 *                      description: Content of the data to be created
 *
 *              example:
 *                  name: Input name 1
 *                  content: Input content 1
 *
 *          UpdateData:
 *              type: object
 *              optional:
 *                  - name
 *                  - content
 *
 *              properties:
 *                  name:
 *                      type: string
 *                      required: false
 *                      description: New name of the data to be updated
 *                  content:
 *                      type: string
 *                      required: false
 *                      description: New content of the data to be updated
 *
 *              example:
 *                  name: Updated name 1
 *                  content: Updated content 1
 *
 *          ServerResponseSuccess:
 *              type: object
 *
 *              properties:
 *                  success:
 *                      type: boolean
 *                      required: true
 *                      description: API request status indicator
 *                  data:
 *                      type: object
 *                      required: false
 *                      description: The data returned by the API after completion
 *
 *              example:
 *                  success: true
 *                  data:
 *                      id: 1
 *                      name: Name of the data
 *                      content: Content of the data
 *
 *          ServerResponseFailure:
 *              type: object
 *
 *              properties:
 *                  success:
 *                      type: boolean
 *                      required: true
 *                      description: API request status indicator
 *
 *                  error:
 *                      type: object
 *                      required: true
 *                      description: The error info occurred while API execution
 *
 *              example:
 *                  success: false
 *                  error: Something went wrong
 */

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
 *      name: Data
 *      description: API to manage Data
 */

/**
 * @swagger
 *      /data:
 *          get:
 *              summary: Fetches all the data
 *              tags: [Data]
 *              responses:
 *                  200:
 *                      description: Returns an array of all the data in the data key of the response object
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
 */

/**
 * @swagger
 *      /data:
 *          post:
 *              summary: Creates new data
 *              tags: [Data]
 *              requestBody:
 *                  required: true
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: array
 *                              $ref: '#/components/schemas/CreateData'
 *
 *              responses:
 *                  200:
 *                      description: The updated data array
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
 *      /data/{id}:
 *          get:
 *              summary: Finds the data of the id provided
 *              tags: [Data]
 *
 *              parameters:
 *                  - in: path
 *                    name: id
 *                    schema:
 *                      type: string
 *                    required: true
 *                    description: The id of the data to be fetched
 *
 *              responses:
 *                  200:
 *                      description: The fetched data
 *                      content:
 *                          application/json:
 *                              schema:
 *                                  type: object
 *                                  $ref: '#/components/schemas/ServerResponseSuccess'
 *
 *                  404:
 *                      description: Data to fetch not found
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
 *      /data/{id}:
 *          put:
 *              summary: Finds and updates the required data
 *              tags: [Data]
 *
 *              parameters:
 *                  - in: path
 *                    name: id
 *                    schema:
 *                      type: string
 *                    required: true
 *                    description: The id of the data to be deleted
 *
 *              requestBody:
 *                  required: true
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: array
 *                              $ref: '#/components/schemas/UpdateData'
 *
 *              responses:
 *                  200:
 *                      description: The updated data
 *                      content:
 *                          application/json:
 *                              schema:
 *                                  type: object
 *                                  $ref: '#/components/schemas/Data'
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
 *                      description: Data to update not found
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
 *      /data/{id}:
 *          delete:
 *              summary: Finds and deletes the required data
 *              tags: [Data]
 *
 *              parameters:
 *                  - in: path
 *                    name: id
 *                    schema:
 *                      type: string
 *                    required: true
 *                    description: The id of the data to be deleted
 *
 *              responses:
 *                  200:
 *                      description: Delete data confirmation
 *                      content:
 *                          application/json:
 *                              schema:
 *                                  type: object
 *                                  $ref: '#/components/schemas/ServerResponseSuccess'
 *
 *                  404:
 *                      description: Data to delete not found
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
