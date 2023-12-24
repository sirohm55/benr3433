
/**
 * @swagger
 * components:
 *      schemas:
 *          User:
 *              type: object
 *              properties:
 *                  _id:
 *                      type: string
 *                  username:
 *                      type: string
 * 
 */

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
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#components/schemas/User'
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

/**
 * @swagger
 * /login/security/logout:
 *      get:    
 *          description: logout   
 *  
 *          response:
 *              200: 
 *                  description: ok
 */