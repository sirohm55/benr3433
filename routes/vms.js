
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
 * /login/user/issue:
 *      post:
 *          description: Issue for visitor pass
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
 *                              $ref: '#components/schemas/User'
 * 
 *     
 */


/**
* @swagger
* /register:
*      post:
*          description: User Register
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
 * /login/user/display:
 *      get:
 *          summary: All register visitors display
 *          responses:
 *              '200':
 *                  describe:   list of visitors
 *          
 * 
 */

/**
 * @swagger
 * /login/visitor/pass:
 *      post:
 *          description: Retrieve visitor pass
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
 *                  description: Successful issue / Unsuccessful issue
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#components/schemas/User'
 * 
 *     
 */

/**
 * @swagger
 * /login/security/access:
 *      get:
 *          summary: All register visitors & users display
 *          responses:
 *              '200':
 *                  describe:   list of visitors & users
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
 *                  description: ok
 */