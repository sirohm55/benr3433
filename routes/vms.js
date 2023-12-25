
/**
 * @swagger
 * components:
 *      schemas:
 *          visitor_display:
 *              type: object
 *              properties:
 *                  _id:
 *                      type: string
 *                  username:
 *                      type: string
 *                  email:
 *                      type: string
 *                  role:
 *                      type: string
 * 
 */

/**
 * @swagger
 * components:
 *      schemas:
 *          db_display:
 *              type: object
 *              properties:
 *                  _id:
 *                      type: string
 *                  ic:
 *                      type: string
 *                  username:
 *                      type: string
 *                  password:
 *                      type: string
 *                  email:
 *                      type: string
 *                  role:
 *                      type: string
 * 
 */

/**
 * @swagger
 * components:
 *      schemas:
 *          appointment:
 *              type: object
 *              properties:
 *                  _id:
 *                      type: string
 *                  name:
 *                      type: string
 *               
 * 
 */

/**
 * @swagger
 * tags:
 *      name: Login_or_Register
 *      description: Action that must be perform before accessing the resources
 */

/**
 * @swagger
 * tags:
 *      name: Visitor
 *      description: API for visitor
 */

/**
 * @swagger
 * tags:
 *      name: Host
 *      description: API for host
 */

/**
 * @swagger
 * tags:
 *      name: Security
 *      description: API for security
 */

/**
* @swagger
* /register:
*      post:
*          summary: User registration (host/visitor)
*          description: User Register
*          tags: [Login_or_Register]
*          requestBody:
*              required: true
*              content:
*                  application/json:
*                      schema:
*                          type: object
*                          properties:
*                               ic:
*                                   type: string 
*                               username:
*                                   type: string
*                               password:
*                                   type: string
*                               email:
*                                    type: string
*                               role:
*                                    type: string
*                                
*          responses:
*              200:
*                  description: display registered visitors
*                  content:
*                      application/json:
*                          schema:
*                              $ref: '#components/schemas/visitor_display'
* 
*     
*/

/**
 * @swagger
 * /login:
 *      post:
 *          summary: user login
 *          description: User Login
 *          tags: [Login_or_Register]
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
 * /login/user/display:
 *      get:
 *          summary: All register visitors display
 *          tags: [Host]
 *          responses:
 *              '200':
 *                  describe:  list of visitors
 *          
 * 
 */

/**
 * @swagger
 * /login/user/issue:
 *      post:
 *          summary: Issue pass for visitor
 *          description: Issue pass for visitor
 *          tags: [Host]
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              visitor_id:
 *                                  type: string
 *                            
 *          responses:
 *              200:
 *                  description: Successful issue / Unsuccessful issue
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#components/schemas/appointment'
 * 
 *     
 */

/**
 * @swagger
 * /login/visitor/pass:
 *      post:
 *          summary: Retrieve visitor pass
 *          description: Retrieve visitor pass
 *          tags: [Visitor]
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              host_id:
 *                                  type: string
 *                            
 *          responses:
 *              200:
 *                  description: Successful retrieve / Unsuccessful retrieve
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#components/schemas/appointment'
 * 
 *     
 */

/**
 * @swagger
 * /login/security/access:
 *      get:
 *          summary: All register visitors & users display
 *          tags: [Security]
 *          responses:
 *              '200':
 *                  describe:  list of visitors & users
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#components/schemas/db_display'
 *          
 * 
 */



/**
 * @swagger
 * /login/logout:
 *      get:    
 *          summary: logout   
 *          responses:
 *              200: 
 *                  description: logout success
 */