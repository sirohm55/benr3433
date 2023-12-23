const express = require('express')
const app = express()
const port = process.env.PORT || 3000;

app.use(express.json());

app.use(express.urlencoded({ extended: false }));

const swaggerUi = require ("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "MyVMS API",
            version: "1.0.0",
        },
    },
    apis: ["./index.js"],
};
const swaggerSpec = swaggerJsdoc (options);
app.use("/api-docs", swaggerUi.serve,swaggerUi.setup(swaggerSpec));

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
 })


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://sirohm55:JUNyantan15243@vms.vbsh1ml.mongodb.net/";

const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });


//global variables
var l = "true";   
var host;
var role;

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
 */

/**
 * @swagger
 * /login/security/logout:
 *      get:        
 *          response:
 *              200: 
 *                  description: ok
 */

async function login(Username,Password){  //user and host login

    const option={projection:{password:0}}  //pipeline to project usernamne and email

    const result = await client.db("user").collection("visitor").findOne({  
        $and:[
            {username:{$eq:Username}},
            {password:{$eq:Password}}
            ]
    },option)

    await client.db("user").collection("visitor").updateOne({  
        username:Username
    },
    {
        $currentDate: {
        "lastCheckinTime": true
     },
    })

    if(result){
        visitor = result.username
        console.log(result)
        console.log("Successfully Login")
        l = "true"
        role = "visitor"
        return result
        //details(result.role)
    }
    else {
        const option={projection:{password:0}}  //pipeline to project usernamne and email

        const result = await client.db("user").collection("host").findOne({
            $and:[
                {username:{$eq:Username}},
                {password:{$eq:Password}}
                ]
        },option)

        if(result){
            host = result.username
            console.log(result)
            console.log("Successfully Login")
            l = "true"
            role = "host"
            return result
            //details(result.role)
            
        }
        else {
            const option={projection:{password:0}}  //pipeline to project usernamne and email

            const result = await client.db("user").collection("security").findOne({
                $and:[
                    {username:{$eq:Username}},
                    {password:{$eq:Password}}
                    ]
            },option)

            if(result){
                console.log(result)
                console.log("Successfully Login")
                l = "true"
                role = "security"
                return result
                //details(result.role)
                
            }
            else{
                return "User not found or password error"
            }
        } 
    }
}
//HTTP login method
app.post('/login', async(req, res) => {   //login
    if(l == "false"){
        res.status(200).send(await login(req.body.username,req.body.password))
    }
    else{
        res.status(200).send("you had logged in")
    }
})

app.get('/login/security/logout', (req, res) => {
    if ((role == "security") && (l == "true")){
        res.send("You have successfully log out")
        l = "false"
    }
    else
        res.send("You had log out")
})

app.get('/', (req, res) => {
    res.redirect ("/api-docs");
 })