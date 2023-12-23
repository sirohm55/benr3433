const express = require('express')
const app = express()
const vmsapi = require ("./routes/vms");
const port = process.env.PORT || 3000;



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

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

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

app.get('/', async(req, res) => {   //login
    
    res.redirect("/login")
    
})

//global variables
global.l = "false"   
var host
var role

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
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
 *          response:
 *              200: 
 *                  description: ok
 * 
 */

async function registerVisitor(regIC,regUsername,regPassword,regEmail,regRole,regLast){  //register visitor
   
    if (await client.db("user").collection("visitor").findOne({_id : regIC})){
        return "Your IC has already registered in the system"
    }
    
    else {
        if( await client.db("user").collection("visitor").findOne({username: regUsername})){
            return "Your Username already exist. Please try to login"
        }

        else if(await client.db("user").collection("visitor").findOne({email: regEmail})){
            return "Your email already exist. Please try to login"
        }

        else{
            await client.db("user").collection("visitor").insertOne({
                "_id":regIC,
                "username":regUsername,
                "password":regPassword,
                "email":regEmail,
                "role":regRole,
                "lastCheckinTime" :regLast
            })
            let data = regUsername+" is successfully register"
            return data
        }
    }
}

async function registerHost(regIC,regUsername,regPassword,regEmail,regRole){  //register host
    if (await client.db("user").collection("host").findOne({_id : regIC})){
        return "Your IC has already registered in the system"
    }
    
    else {
        if( await client.db("user").collection("host").findOne({username: regUsername})){
            return "Your Username already exist. Please try to login"
        }

        else if(await client.db("user").collection("host").findOne({email: regEmail})){
            return "Your email already exist. Please try to login"
        }

        else{
            await client.db("user").collection("host").insertOne({
                "_id":regIC,
                "username":regUsername,
                "password":regPassword,
                "email":regEmail,
                "role":regRole
            })
            let data = regUsername + " is successfully register"
            return data
        }
    }
}

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

async function deleteVisitorAcc(Username){  //delete visitor acc
    const result = await client.db("user").collection("visitor").deleteOne({
        username:{$eq:Username}
    })

    await client.db("user").collection("host").updateMany({
     
    },{$pull:{visitor:{name:Username}}},{upsert:true})

    if(result.deletedCount == 1){
        console.log(result)
        return "The account was successfully deleted"
    }
    else{
        return "The account you was tried to delete doesn't exist"
    }
}

async function deleteHostAcc(Username){  //delete host acc
    const result = await client.db("user").collection("host").deleteOne({
        username:{$eq:Username}
    })

    await client.db("user").collection("visitor").updateMany({
        
    },{$pull:{host:{name:Username}}},{upsert:true})

    if(result.deletedCount == 1){   //if the acc exists, delete the acc
        console.log(result)
        return "The account was successfully deleted"
    }
    else{   
        return "The account you was tried to delete doesn't exist"
    }
}

async function updateVisitorPass(regPassword){  //change only when password is different
    result = await client.db("user").collection("visitor").findOne ({username:{$eq:visitor}})

    if (result.password != regPassword){
        await client.db("user").collection("visitor").updateOne({
            username:{$eq:visitor}
        },{$set:{password:regPassword}})

        let data = "Password "+visitor+" is successfully updated"
        return data
    }
    else
        return "Same password cannot be applied"
}        

async function updateHostPass(regPassword){

    result = await client.db("user").collection("host").findOne ({username:{$eq:host}})

    if (result.password != regPassword){
        await client.db("user").collection("host").updateOne({
            username:{$eq:host}
        },{$set:{password:regPassword}})

        let data= "Password "+host+" is successfully updated"
        return data
    }
    else
        return "Same password cannot be applied"
}

async function addVisitor(visitorIC,visitorName,phoneNumber,companyName,date,time){
    //to check whether there is same visitor in array
    let result = await client.db("user").collection("visitor").findOne({_id: visitorIC, username: visitorName})
    
    if (result){
        let addVis = await client.db("user").collection("visitor").findOne({_id: visitorIC, username: visitorName, "host.name": host, "host.time": time, "host.date": date})
        if (!addVis){
            await client.db("user").collection("host").updateOne({
                username: host
            },{$push:{visitor:{name:visitorName,phone:phoneNumber,company:companyName,date:date,time:time}}},{upsert:true})

            await client.db("user").collection("visitor").updateOne({
                username:{$eq:visitorName}
            },{$push:{host:{name:host,date:date,time:time}}})
            console.log("The visitor is added successfully")
            return "The visitor is added successfully"
        }
        else
            console.log ("The visitor you entered already in list")
            return "The visitor you entered already in list"

    }
    else 
        console.log ("The visitor you entered hasn't registered, please register with security in charge")
        return "The visitor you entered hasn't registered, please register with security in charge"
            
            
}

async function removeVisitor(removeVisitor,removeDate,removeTime){
    
    let result = await client.db("user").collection("visitor").findOne({username: removeVisitor, "host.name": host, "host.date":removeDate,"host.time":removeTime})
    if (result){
        await client.db("user").collection("host").updateOne({
            username: host
        },{$pull:{visitor:{name:removeVisitor},visitor:{date:removeDate},visitor:{time:removeTime}}},{upsert:true})

        
        await client.db("user").collection("visitor").updateOne({
            username: removeVisitor
        },{$pull:{host:{name:host,date:removeDate,time:removeTime}}},{upsert:true})

        console.log("Visitor",removeVisitor,"is successfully remove")
        let data = "Visitor "+removeVisitor+" is successfully remove"
        return data
    }
    else
        console.log ("No appointment found")
        return "No appointment found"
}

async function searchVisitor(IC){
    const option={projection:{password:0,role:0}}  //pipeline to project usernamne and email

    const result = await client.db("user").collection("visitor").findOne({
        _id:{$eq:IC}
    },option)
    console.log(result)
    return result
}

//HTTP login method


app.post('/login', async(req, res) => {   //login
    if(l == "false"){
        res.send(await login(req.body.username,req.body.password))
    }
    else{
        res.send("you had logged in")
    }
})


//visitor HTTP methods    

app.post('/login/visitor', async(req, res) => {   //login
    res.send(await login(req.body.username,req.body.password))
})

app.post('/login/visitor/updatePassword', async(req, res) => {   //login
    if ((role == "visitor") && (l == "true")){
        res.send (await updateVisitorPass(req.body.password))
    }
    else
        res.send ("You are not a visitor")
})

app.get('/login/visitor/logout', (req, res) => {
    if ((role == "visitor") && (l == "true")){
        res.send("You have successfully log out")
        l = "false"
    }
    else
        res.send ("You had log out")
})
    
//host http method 

app.post('/login/host', async(req, res) => {   //login
    
    res.send(await login(req.body.username,req.body.password))
    
})

app.post('/login/host/updatePassword', async(req, res) => {   //login
    if ((role == "host") && (l == "true")){
        res.send(await updateHostPass(req.body.password))
    }
    else
        res.send ("You are not a host") 
})

app.post('/login/host/search', async(req, res) => {   //look up visitor details
    if ((role == "host") && (l == "true"))
        res.send (await searchVisitor(req.body._id))
    else
        res.send ("You are not a host")
})

app.post('/login/host/addVisitor', async (req, res) => {   //add visitor
    if ((role == "host") && (l == "true")){
        let response = await addVisitor(req.body.Ic,req.body.visitorName,req.body.phoneNumber,req.body.companyName,req.body.date,req.body.time)
        res.send (response)
    }
    else
        console.log ("You are not a host")
})

app.post('/login/host/removeVisitor', (req, res) => {   //remove visitor
    if ((role == "host") && (l == "true")){
        let response = removeVisitor(req.body.visitorName,req.body.date,req.body.time)
        res.send (response)
    }
    else
        console.log ("You are not a host")
})

app.get('/login/host/logout', (req, res) => { 
    if ((role == "host") && (l == "true")){
        res.send("You have successfully log out")
        l = "false"    
    }   
    else
        res.send ("You had log out")
})
    
//security http mehtods    

app.post("/login/security/deleteHost" , async(req, res) => {  //delete host
    if ((role == "security") && (l == "true"))
        res.send(await deleteHostAcc(req.body.username))
    else
        res.send ("You are not a security")
})

app.post("/login/security/deleteVisitor" , async(req, res) => {  //delete visitor
    if ((role == "security") && (l == "true"))
        res.send(await deleteVisitorAcc(req.body.username))
    else
        res.send ("You are not a security")
})

app.post("/login/security/register/visitor" , async (req, res) => {  //register visitor
    if ((role == "security") && (l == "true"))
        res.send(await registerVisitor(req.body._id,req.body.username,req.body.password,req.body.email,req.body.role,req.body.lastCheckinTime))
    else
        res.send ("You are not a security")
})
        
app.post("/login/security/register/host" , async(req, res) => {  //register host
    if ((role == "security") && (l == "true"))
        res.send(await registerHost(req.body._id,req.body.username,req.body.password,req.body.email,req.body.role))    
    else
        res.send ("You are not a security")     
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
    res.send ("welcome to management system");
 })