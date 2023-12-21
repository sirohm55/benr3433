/**
 * @swagger
 * /login:
 *      post:
 *          description: User Login
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              username:
 *                                  type: string
 *                              password:
 *                                  type: string
 *          responses:
 *              200:
 *                  description: Successful login / Unsuccessful login
 * 
 *     
 */

/**
 * @swagger
 * /login/visitor/updatePassword:
 *      post:
 *          description: password change
 *          requestBody:
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              password:
 *                                  type: string
 * 
 */