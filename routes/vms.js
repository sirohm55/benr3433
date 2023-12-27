
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
 *      name: Login_or_Logout
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
 *      description: API for host (user)
 */

/**
 * @swagger
 * tags:
 *      name: Security
 *      description: API for security 
 */

/**
 * @swagger
 * tags:
 *      name: Admin
 *      description: API for Admin (administrator)
 */

/**
 * @swagger
 * /login:
 *      post:
 *          summary: user login
 *          description: User Login
 *          tags: [Login_or_Logout]
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
 */

/**
 * @swagger
 * /login/user/display_issue_users:
 *      get:
 *          summary: display all pass issued to visitor 
 *          tags: [Host]
 *          responses:
 *              '200':
 *                  describe:  list of visitors pass
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
 */

/**
 * @swagger
 * /login/visitor/display_pass:
 *      get:
 *          summary: All pass from host
 *          tags: [Visitor]
 *          responses:
 *              '200':
 *                  describe:  list of visitors pass
 */

/**
* @swagger
* /security/register:
*      post:
*          summary: Host registration
*          description: User Register
*          tags: [Security]
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
*                  description: register successfully/ register unsuccessful 
*/

/**
* @swagger
* /security/delete:
*      post:
*          summary: Host delete 
*          description: Host Delete
*          tags: [Security]
*          requestBody:
*              required: true
*              content:
*                  application/json:
*                      schema:
*                          type: object
*                          properties:
*                               id:
*                                   type: string
*                               username:
*                                   type: string
*                               email:
*                                    type: string
*                                
*          responses:
*              200:
*                  description: register successfully/ register unsuccessful 
*/

/**
 * @swagger
 * /login/admin_login:
 *      post:
 *          summary: user login
 *          description: User Login
 *          tags: [Admin]
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
 *                              secret:
 *                                  type: string
 *          responses:
 *              200:
 *                  description: Successful login / Unsuccessful login
 *                      
 */

/**
 * @swagger
 * /login/admin/access:
 *      get:
 *          summary: All register visitors & users display
 *          tags: [Admin]
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
 *          tags: [Login_or_Logout] 
 *          responses:
 *              200: 
 *                  description: logout success
 */