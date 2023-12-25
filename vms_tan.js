const express = require('express')
const app = express()
const port = process.env.PORT || 3000;
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


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
    apis: ["./routes/*.js"],
};
const swaggerSpec = swaggerJsdoc (options);
app.use("/api-docs", swaggerUi.serve,swaggerUi.setup(swaggerSpec));

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
 })


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = "mongodb+srv://sirohm55:JUNyantan15243@vms.vbsh1ml.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });

//global variables
var l = "false";
var jwt_token;  
var token_state 
var id;
var role;
var state = 0;


function create_jwt (payload){
    jwt_token = jwt.sign(payload, 'hello_goh', {expiresIn: "10m"});
    return 
}

async function login(Username,Password){  //user and host login

    const option={projection:{password:0}}  //pipeline to project usernamne and email

    const result = await client.db("user").collection("visitor").findOne({  
        $and:[
            {username:{$eq:Username}},
            {password:{$eq:Password}}
            ]
    },option)

    if(result){
        visitor = result.username
        console.log(result)
        console.log("Successfully Login")
        create_jwt ({id: result._id, role: result.role})
        return result.username + " Successfully Login"
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
            create_jwt ({id: result._id, role: result.role})
            return result.username + " Successfully Login"
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
                create_jwt ({id: result._id, role: result.role})
                return result.username + " Successfully Login"
                //details(result.role)
                
            }
            else{
                state = 1
                return "User not found or password error"
            }
        } 
    }
}

async function visitor_display (){
    const option={projection:{password:0,ic:0}}
    const result = await client.db("user").collection("visitor").find ({},option).toArray (function(err, result){
        if (err) throw err;
    })
    console.log (result)
    return result
}

async function registerUser (regIC,regUsername,regPassword,regEmail,Role){
    if (await client.db("user").collection(Role).findOne({_id : regIC})){
        return "Your IC has already registered in the system"
    }
    
    else {
        if( await client.db("user").collection(Role).findOne({username: regUsername})){
            return "Your username already exist. Please use other username"
        }

        else if(await client.db("user").collection(Role).findOne({email: regEmail})){
            return "Your email already exist. Please use other email"
        }

        else{
            await client.db("user").collection(Role).insertOne({
                "ic":regIC,
                "username":regUsername,
                "password":regPassword,
                "email":regEmail,
                "role":Role
            })
            let data = regUsername + " is successfully register"
            return data
        }
    }
}

async function issue_pass (issue_num){

    var mongo = require ("mongodb")
    const o_id_visitor = new mongo.ObjectId(issue_num)
    const o_id_host = new mongo.ObjectId(id)

    if (!(await client.db("user").collection("visitor").findOne({_id : o_id_visitor}))){
        return "Invalid visitor id"
    }
    else {
        if(await client.db("user").collection("host").findOne({_id: o_id_host})){
                let visitor_data = await client.db("user").collection("visitor").findOne({_id : o_id_visitor})
                let host_data = await client.db("user").collection("host").findOne({_id : o_id_host})
                if(await client.db("user").collection("host").findOne({_id: o_id_host, "visitor._id": o_id_visitor,"visitor.name": visitor_data.username}))
                    return "the visitor pass you issued has already in the list"
                await client.db("user").collection("host").updateOne({
                    _id:{$eq:o_id_host}
                },{$push:{visitor:{_id: o_id_visitor, name: visitor_data.username}}},{upsert:true})
                
                await client.db("user").collection("visitor").updateOne({
                    _id:{$eq:o_id_visitor}
                },{$push:{host:{_id: o_id_host, name: host_data.username}}})
                console.log("The visitor is added successfully")
                return "The visitor is added successfully"
                
            }
        else
            return "you have not login"

        }
}

async function retrieve_pass (retrieve_num){

    var mongo = require ("mongodb")
    const o_id_visitor = new mongo.ObjectId(id)
    const o_id_host = new mongo.ObjectId(retrieve_num)

    if(!(await client.db("user").collection("host").findOne({_id: o_id_host})))
        return "Invalid host id number"

    let visitor_data = await client.db("user").collection("visitor").findOne({_id : o_id_visitor})
    let host_data = await client.db("user").collection("host").findOne({_id : o_id_host})

    if(!(await client.db("user").collection("host").findOne({_id: o_id_host, "visitor._id": o_id_visitor,"visitor.name": visitor_data.username})))
        return "host does not issue pass to " + visitor_data.username

    await client.db("user").collection("host").updateOne({
        _id: o_id_host
    },{$pull:{visitor:{name:visitor_data.username},visitor:{_id: o_id_visitor}}},{upsert:true})

    
    await client.db("user").collection("visitor").updateOne({
        _id: o_id_visitor
    },{$pull:{host:{name:host_data.username,_id: o_id_host}}},{upsert:true})

    console.log("Visitor",visitor_data.username,"is successfully remove")
    return "Visitor "+visitor_data.username+" is successfully retrieve the pass"

}

async function view_database (){
    
    const result_visitor = await client.db("user").collection("visitor").find ({}).toArray (function(err, result){
        if (err) throw err;
    })

    const result_host = await client.db("user").collection("host").find ({}).toArray (function(err, result){
        if (err) throw err;
    })

    console.log (result_visitor.concat(result_host))
    return result_visitor.concat(result_host)
}

//HTTP login method
app.post('/login',verifyToken, async(req, res) => {   //login
    if(token_state == 0){
        let answer = await login(req.body.username,req.body.password);
        if (state == 0){
            res.cookie("sessid", jwt_token, {
                httpOnly: true,
            });
        }
        res.status(200).send(answer)
    }
    else{
        res.status(200).send("you had logged in")
    }
})

app.get('/login/user/display', async(req, res) => {
    if (token_state == 1 )
        if (role == "host")
            res.send (await visitor_display ())
        else
            res.send ("you are not a host")
    else
        res.send ("you have not login yet")

})

app.post("/register" , async (req, res) => {  //register visitor
    if ((req.body.role == "user") || (req.body.role == "visitor"))
        if (req.body.ic.length != 14)
            res.send ("ic number invalid")
        else
            res.send(await registerUser(req.body.ic, req.body.username, req.body.password, req.body.email, req.body.role))
    else
        res.send("role must be user or visitor")

})

app.post ('/login/user/issue', verifyToken, async(req, res) => {
    if (token_state == 1 )
        if (role == "host")
            if (req.body.visitor_id.length == 24)
                res.send(await issue_pass (req.body.visitor_id))
            else
                res.send("Invalid visitor id")
        else
            res.send ("you are not a host")
    else
        res.send("you have not login yet")
})

app.post ('/login/visitor/pass', verifyToken, async(req, res) => {
    if (token_state == 1 )
        if (role == "visitor")
            if (req.body.host_id.length == 24)
                res.send(await retrieve_pass (req.body.host_id))
            else
                res.send("Invalid host id")
        else
            res.send ("you are not a visitor")
    else
        res.send ("you have not login yet")

})

app.get ('/login/security/access', verifyToken, async(req, res) => {
    if ((token_state == 1) && (role == "security"))
        res.send(await view_database ())
    else
        res.send ("you have not login yet")
})

app.get('/login/logout', (req, res) => {
        console.log ("logout")
        res.clearCookie("sessid").send("You have log out")
})

app.get('/', (req, res) => {
    console.log("check2")
    res.redirect ("/api-docs");
 })

function verifyToken (req, res, next){
    const token = req.cookies.sessid;
    if (!token){
        console.log("no token")
        token_state = 0;
        return next()
    }
        
    const user = jwt.verify (token, 'hello_goh', (err,user) => {
        if (err){
            console.log ("Invalid token")
            token_state = 0;
            return next()
        }
        console.log ("checkpoint")
        token_state = 1;
        req.user = user;
        role = user.role;
        id = user.id
        console.log(role, id)
        return next()
    });
}

