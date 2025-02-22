// **********************
// TAGS
// **********************

/**
 * @swagger
 *  tags:
 *      name: Auth
 *      description: APIs to user authentication and authorization
 */

// **********************
// DATA TYPES
// **********************

/**
 * @swagger
 * components:
 *      schemas:
 *          Auth:
 *              type: object
 *
 *              required:
 *                  - id
 *                  - username
 *                  - email
 *                  - password
 *
 *              properties:
 *                  id:
 *                      type: string
 *                      description: Auto generated id of todo
 *
 *                  username:
 *                      type: string
 *                      description: username of the user
 *
 *                  email:
 *                      type: string
 *                      description: Email of the user
 *
 *                  password:
 *                      type: string
 *                      description: Password of the user
 *
 *              example:
 *                  id: 67ba1faebbd917dc01bf5ef6
 *                  name: user1
 *                  content: user1@email.com
 *                  password: password1
 *
 *          AuthInfo:
 *              type: object
 *              required:
 *                  - id
 *                  - username
 *                  - email
 *
 *              properties:
 *                  id:
 *                      type: string
 *                      description: Auto generated id of todo
 *
 *                  username:
 *                      type: string
 *                      description: username of the user
 *
 *                  email:
 *                      type: string
 *                      description: Email of the user
 *
 *              example:
 *                  id: 67ba1faebbd917dc01bf5ef6
 *                  name: user1
 *                  email: user1@email.com
 *
 *          Signup:
 *              type: object
 *
 *              properties:
 *                  username:
 *                      type: string
 *                      description: Username of the user to be signed up
 *
 *                  email:
 *                      type: string
 *                      description: Email of the user to be signed up
 *
 *                  password:
 *                      type: string
 *                      description: Password of the user to be signed up
 *
 *              required:
 *                  - username
 *                  - email
 *                  - password
 *
 *              example:
 *                  username: user1
 *                  email: user1@email.com
 *                  password: password1
 *
 *          LoginUsername:
 *              type: object
 *
 *              properties:
 *                  username:
 *                      type: string
 *                      description: Username of the user to be logged in
 *
 *                  password:
 *                      type: string
 *                      description: Password of the user to be logged in
 *
 *              required:
 *                  - username
 *                  - password
 *
 *              example:
 *                  username: user1
 *                  password: password1
 *
 *          LoginEmail:
 *              type: object
 *
 *              properties:
 *                  email:
 *                      type: string
 *                      description: Email of the user to be logged in
 *
 *                  password:
 *                      type: string
 *                      description: Password of the user to be logged in
 *
 *              required:
 *                  - email
 *                  - password
 *
 *              example:
 *                  email: user1@email.com
 *                  password: password1
 *
 *          UpdateUser:
 *              type: object
 *              tags: [Auth]
 *
 *              properties:
 *                  username:
 *                      type: string
 *                      description: Username of the user to be updated
 *
 *                  email:
 *                      type: string
 *                      description: Email of the user to be updated
 *
 *                  password:
 *                      type: string
 *                      description: Password of the user to be updated
 *
 *              example:
 *                  username: user1
 *                  email: user1@email.com
 *                  password: password1
 */

// **********************
// ROUTES
// **********************

/**
 * @swagger
 *      /auth/signup:
 *          post:
 *              summary: Signup a new user
 *              tags: [Auth]
 *
 *              requestBody:
 *                  required: true
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: array
 *                              $ref: '#/components/schemas/Signup'
 *
 *              responses:
 *                  201:
 *                      description: A new user has been signed up
 *
 *                      headers:
 *                          Set-Cookie:
 *                              schema:
 *                                  type: string
 *                                  format: cookie
 *                              description: Session cookie
 *
 *                      content:
 *                          application/json:
 *                              schema:
 *                                  type: object
 *                                  $ref: '#/components/schemas/AuthInfo'
 *
 *                  400:
 *                      description: Invalid data provided to signup
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
 *      /auth/login:
 *          post:
 *              summary: Log a user in
 *              tags: [Auth]
 *
 *              requestBody:
 *                  required: true
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: array
 *                              oneOf:
 *                                  - $ref: '#/components/schemas/LoginUsername'
 *                                  - $ref: '#/components/schemas/LoginEmail'
 *
 *              responses:
 *                  200:
 *                      description: User logged in successfully
 *
 *                      headers:
 *                          Set-Cookie:
 *                              schema:
 *                                  type: string
 *                                  format: cookie
 *                              description: Session cookie
 *
 *                      content:
 *                          application/json:
 *                              schema:
 *                                  type: object
 *                                  $ref: '#/components/schemas/AuthInfo'
 */

/**
 * @swagger
 *      /auth/logout:
 *          post:
 *              summary: Log a user in
 *              tags: [Auth]
 *
 *              security:
 *                  - sessionAuth: []
 *
 *              responses:
 *                  200:
 *                      description: User logged in successfully
 *                      content:
 *                          application/json:
 *                              schema:
 *                                  type: object
 *                                  properties:
 *                                      success:
 *                                          type: boolean
 *                                          description: The completion status of API
 */

/**
 * @swagger
 *      /auth:
 *          get:
 *              summary: Fetch logged in user info
 *              tags: [Auth]
 *
 *              security:
 *                  - sessionAuth: []
 *
 *              responses:
 *                  200:
 *                      description: Fetched user info successfully
 *                      content:
 *                          application/json:
 *                              schema:
 *                                  type: object
 *                                  $ref: '#/components/schemas/AuthInfo'
 */

/**
 * @swagger
 *      /auth:
 *          put:
 *              summary: Update user info
 *              tags: [Auth]
 *
 *              security:
 *                  - sessionAuth: []
 *
 *              requestBody:
 *                  required: true
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: array
 *                              $ref: '#/components/schemas/UpdateUser'
 *
 *              responses:
 *                  200:
 *                      description: Fetched user info successfully
 *                      content:
 *                          application/json:
 *                              schema:
 *                                  type: object
 *                                  $ref: '#/components/schemas/AuthInfo'
 */

/**
 * @swagger
 *      /auth:
 *          delete:
 *              summary: Delete user
 *              tags: [Auth]
 *
 *              security:
 *                  - sessionAuth: []
 *
 *              responses:
 *                  200:
 *                      description: Deleted user successfully
 *                      content:
 *                          application/json:
 *                              schema:
 *                                  type: object
 *                                  properties:
 *                                      success:
 *                                          type: boolean
 *                                          description: Completion status of the API
 */
