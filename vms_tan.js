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

//visitor api

async function delete_pass (del_visitor_pass){

    var mongo = require ("mongodb")
    const o_id_visitor = new mongo.ObjectId(del_visitor_pass)
    const o_id_host = new mongo.ObjectId(id)

    if (!(await client.db("user").collection("visitor").findOne({_id : o_id_visitor}))){
        return "Invalid visitor id"
    }
    else {
        if(await client.db("user").collection("host").findOne({_id: o_id_host})){
                let visitor_data = await client.db("user").collection("visitor").findOne({_id : o_id_visitor})
                let host_data = await client.db("user").collection("host").findOne({_id : o_id_host})
                if(!(await client.db("user").collection("host").findOne({_id: o_id_host, "visitor._id": o_id_visitor,"visitor.name": visitor_data.username})))
                    return "the visitor pass you issued is not in the list"
                await client.db("user").collection("host").updateOne({
                    _id:{$eq:o_id_host}
                },{$pull:{visitor:{_id: o_id_visitor, name: visitor_data.username}}},{upsert:true})
                
                await client.db("user").collection("visitor").updateOne({
                    _id:{$eq:o_id_visitor}
                },{$pull:{host:{_id: o_id_host, name: host_data.username}}},{upsert:true})
                console.log("The visitor pass is removed successfully")
                return "The visitor pass is removed successfully"
                
            }
        else
            return "you have not login"
        }
}

async function host_list (){
    var mongo = require ("mongodb")
    const o_id_visitor = new mongo.ObjectId(id)
    const option={projection:{"host":1}}
    const answer = await client.db("user").collection("visitor").findOne({_id: o_id_visitor},option)
    console.log (answer.host)
    return answer.host
}

async function retrieve_pass (retrieve_num){

    var mongo = require ("mongodb")
    const o_id_visitor = new mongo.ObjectId(id)
    const o_id_host = new mongo.ObjectId(retrieve_num)

    if(!(await client.db("user").collection("host").findOne({_id: o_id_host})))
        return "Invalid host id number"

    let visitor_data = await client.db("user").collection("visitor").findOne({_id : o_id_visitor})
    let host_data = await client.db("user").collection("host").findOne({_id : o_id_host})

    if(await client.db("user").collection("waiting").findOne({"visitor_name": visitor_data.username, "host_name": host_data.username, "host_unit_number": host_data.unit_number, "host_contact_number": host_data.contact_number})){
        return "Your visitor pass is waiting for approval"
    }

    if(!(await client.db("user").collection("host").findOne({_id: o_id_host, "visitor._id": o_id_visitor,"visitor.name": visitor_data.username}))){
        return "host does not issue pass to " + visitor_data.username 
    }

    await client.db("user").collection("host").updateOne({
        _id: o_id_host
    },{$pull:{visitor:{name:visitor_data.username},visitor:{_id: o_id_visitor}}},{upsert:true})

    
    await client.db("user").collection("visitor").updateOne({
        _id: o_id_visitor
    },{$pull:{host:{name:host_data.username,_id: o_id_host}}},{upsert:true})

    await client.db("user").collection("waiting").insertOne({
        "visitor_name": visitor_data.username, "host_name": host_data.username, "host_unit_number": host_data.unit_number, "host_contact_number": host_data.contact_number
    })

    console.log("Visitor",visitor_data.username,"is successfully remove")
    return "Visitor "+visitor_data.username+" is successfully retrieve the pass, host is located at unit number " + host_data.unit_number+ ". Please wait for the approval from the security"
}

//host api

async function visitor_display (){
    const option={projection:{password:0,ic:0,host:0}}
    const result = await client.db("user").collection("visitor").find ({},option).toArray (function(err, result){
        if (err) throw err;
    })
    console.log (result)
    return result
}

async function registerUser (regIC,regUsername,regPassword,regEmail,regUnit,regContact){

    const punctuation= '~`!@#$%^&*()-_+={}[]|\;:"<>,./?';
    let Punch = 0
    let Capital = 0

    if (regPassword.length < 8)
        return "Password must be at least 8 characters long"

    for (i=0; i<(regPassword.length); i++){
        if (punctuation.includes(regPassword[i])){
            Punch = 1;
            continue
        }
        if ((regPassword [i].toUpperCase()) == regPassword [i]){
            Capital = 1;
            continue}
    }

    if ((Punch == 0) || (Capital == 0))
        return "Password must contains Special character and Capital letter"

    if (await client.db("user").collection("register").findOne({ic:regIC,username:regUsername,unit_number:regUnit,email:regEmail,contact_number: regContact})){
        return "request pending"
    }

    if (await client.db("user").collection("host").findOne({ic:regIC})){
        return "Your IC has already registered in the system"
    }
    
    else {
        if(await client.db("user").collection("host").findOne({username: regUsername}) || await client.db("user").collection("register").findOne({username: regUsername})){
            return "Your username already exist. Please use other username"
        }

        else if(await client.db("user").collection("host").findOne({unit_number: regUnit}) || await client.db("user").collection("register").findOne({unit_number: regUnit})){
            return "Your unit number already registered. Please try again"
        }

        else if(await client.db("user").collection("host").findOne({email: regEmail}) || await client.db("user").collection("register").findOne({email: regEmail})){
            return "Your email already exist. Please use other email"
        }

        else if(await client.db("user").collection("host").findOne({contact_number: regContact}) || await client.db("user").collection("register").findOne({contact_number: regContact})){
            return "Your contact number already exist. Please use other contact number"
        }

        else{
            await client.db("user").collection("register").insertOne({
                "ic":regIC,
                "username":regUsername,
                "password":regPassword,
                "email":regEmail,
                "contact_number": regContact,
                "unit_number": regUnit,
                "role":"host"
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

//security function

async function registration_display (){

    const option={projection:{password:0}}

    const result = await client.db("user").collection("register").findOn({}, option)

    return result
}

async function host_approval (regID){
    var mongo = require ("mongodb")
    const host_id = new mongo.ObjectId(regID)
    const option={projection:{_id:0}}

    const result = await client.db("user").collection("register").findOne({_id:host_id}, option)

    console.log (result)
    if (!result)
        return "host registration id not found"

    await client.db("user").collection("host").insertOne({
        "ic":result.ic,
        "username": result.username,
        "password": result.password,
        "email": result.email,
        "contact_number": result.contact_number,
        "unit_number": result.unit_number,
        "role": "host"
    })
    await client.db("user").collection("register").deleteOne({
        _id:{$eq:host_id}
    })
    return "host registered successfully"
}

async function host_rejection (regID){
    var mongo = require ("mongodb")
    const host_id = new mongo.ObjectId(regID)
    const option={projection:{_id:0}}

    const result = await client.db("user").collection("register").findOne({_id:host_id}, option)

    console.log (result)
    if (!result)
        return "host registration id not found"

    await client.db("user").collection("register").deleteOne({
        _id:{$eq:host_id}
    })
    return "host rejected successfully"
}

async function pass_display (){
    const result = await client.db("user").collection("waiting").find ({}).toArray (function(err, result){
        if (err) throw err;
    })
    console.log (result)
    return result
}

async function pass_verification (ref_num){
    var mongo = require ("mongodb")
    const ref = new mongo.ObjectId(ref_num)
    const option={projection:{_id:0}}

    const result = await client.db("user").collection("waiting").findOne({_id:ref},option)

    if(!result)
        return "visitor pass not found"

    await client.db("user").collection("waiting").deleteOne({
        _id:{$eq:ref}
    })

    return "visitor pass is verified\n" +result.visitor_name +"\n"+ result.host_name +"\n"+ result.host_unit_number +"\n"+ result.host_contact_number

}

async function user_display (){
    const option={projection:{password:0,ic:0,visitor:0}}
    const result = await client.db("user").collection("host").find ({},option).toArray (function(err, result){
        if (err) throw err;
    })
    console.log (result)
    return result
}

async function deleteUser(Id, Username, Email){

    var mongo = require ("mongodb")
    const host_id = new mongo.ObjectId(Id)

    const result = await client.db("user").collection("host").findOne({
        $and:[
            {username:{$eq:Username}},
            {_id:{$eq:host_id}},
            {email:{$eq:Email}}
            ]
        })
    
    if (!result)
        return "Host not found"
    
    while (await client.db("user").collection("visitor").findOne({"host._id" : host_id})){
        await client.db("user").collection("visitor").updateOne({
            "host._id" : host_id
        },{$pull:{host:{name:result.username,_id: host_id}}},{upsert:true})
    }
    
    await client.db("user").collection("host").deleteOne({
            _id:{$eq:host_id}
        })
    
    return result.username + " deleted successfully"
}

async function visitor_list (){
    var mongo = require ("mongodb")
    const o_id_host = new mongo.ObjectId(id)
    const option={projection:{"visitor":1}}
    const answer = await client.db("user").collection("host").findOne({_id: o_id_host},option)
    console.log (answer.visitor)
    return answer.visitor

}

async function deleteVisitor(Id, Username, Email){

    var mongo = require ("mongodb")
    const visitor_id = new mongo.ObjectId(Id)

    const result = await client.db("user").collection("visitor").findOne({
        $and:[
            {username:{$eq:Username}},
            {_id:{$eq:visitor_id}},
            {email:{$eq:Email}}
            ]
        })
    
    if (!result)
        return "Visitor not found"
    
    while (await client.db("user").collection("host").findOne({"visitor._id" : visitor_id})){
        await client.db("user").collection("host").updateOne({
            "visitor._id" : visitor_id
        },{$pull:{visitor:{name:result.username,_id: visitor_id}}},{upsert:true})
    }
    
    await client.db("user").collection("visitor").deleteOne({
            _id:{$eq:visitor_id}
        })
    
    return result.username + " deleted successfully"
}

//admin function

async function login_admin(Username,Password,Secret){

    const result = await client.db("user").collection("admin").findOne({  
        $and:[
            {username:{$eq:Username}},
            {password:{$eq:Password}},
            {secret:{$eq:Secret}}
            ]
    })

    if(result){
        admin = result.username
        console.log(result)
        console.log("Successfully Login")
        create_jwt ({id: result._id, role: result.role})
        return admin + " Successfully Login"
    }

    else{
        state = 1
        return "username/password/secret is incorrect"
    } 


}

async function view_database (){
    
    const result_visitor = await client.db("user").collection("visitor").find ({}).toArray (function(err, result){
        if (err) throw err;
    })

    const result_host = await client.db("user").collection("host").find ({}).toArray (function(err, result){
        if (err) throw err;
    })

    const result_security = await client.db("user").collection("security").find ({}).toArray (function(err, result){
        if (err) throw err;
    })

    console.log (result_visitor.concat(result_host))
    const result = result_visitor.concat(result_host)
    return result.concat(result_security)
}

async function toHostRole(ID){
    var mongo = require ("mongodb")
    const secure_id = new mongo.ObjectId(ID)

    const result = await client.db("user").collection("security").findOne({_id:secure_id})

    if (!result)
        return "security not found"

    if(await client.db("user").collection("host").findOne({ic: result.ic, username: result.username, password: result.password, email: result.email, contact_number: result.contact_number, unit_number: result.unit_number})){
        return "security is already a host"
    }

    await client.db("user").collection("host").insertOne({
        "ic":result.ic,
        "username": result.username,
        "password": result.password,
        "email": result.email,
        "contact_number": result.contact_number,
        "unit_number": result.unit_number,
        "role": "host"
    })

    await client.db("user").collection("security").deleteOne({
        _id:{$eq:secure_id}
    })

    return "security " + result.username + " has successfully became host"

}

async function toSecurityRole(ID){
    var mongo = require ("mongodb")
    const host_id = new mongo.ObjectId(ID)

    const result = await client.db("user").collection("host").findOne({_id:host_id})

    if (!result)
        return "host not found"

    if(await client.db("user").collection("security").findOne({ic: result.ic, username: result.username, password: result.password, email: result.email, contact_number: result.contact_number, unit_number: result.unit_number})){
        return "host is already a security"
    }

    await client.db("user").collection("security").insertOne({
        "ic":result.ic,
        "username": result.username,
        "password": result.password,
        "email": result.email,
        "contact_number": result.contact_number,
        "unit_number": result.unit_number,
        "role": "security"
    })

    await client.db("user").collection("host").deleteOne({
        _id:{$eq:host_id}
    })

    return "host " + result.username + " has successfully became security"

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
        res.status(200).send("you had logged in as " + role)
    }
    state = 0
})

//visitor api

app.post ('/login/visitor/pass', verifyToken, async(req, res) => {
    if (token_state == 1 ){
        if (role == "visitor"){
            if (req.body.host_id.length == 24)
                res.send(await retrieve_pass (req.body.host_id))
            else
                res.send("invalid host id")
        }
        else
            res.send ("you are not a visitor")
    }   
    else
        res.send ("you have not login yet")

})

app.get ('/login/visitor/display_pass', verifyToken, async(req, res) => {
    if (token_state == 1 ){
        if (role == "visitor"){
            res.send (await host_list ())
        }
        else
            res.send ("you are not a visitor")
    }   
    else
        res.send ("you have not login yet")

})

//host api

app.get('/login/user/display',verifyToken, async(req, res) => {
    if (token_state == 1 )
        if (role == "host")
            res.send (await visitor_display ())
        else
            res.send ("you are not a host")
    else
        res.send ("you have not login yet")
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

app.post ('/login/user/delete_pass', verifyToken, async(req, res) => {
    if (token_state == 1 )
        if (role == "host")
            if (req.body.visitor_id.length == 24)
                res.send(await delete_pass (req.body.visitor_id))
            else
                res.send("Invalid visitor id")
        else
            res.send ("you are not a host")
    else
        res.send("you have not login yet")
})

app.get ('/login/user/display_issue_users', verifyToken, async(req, res) => {
    if (token_state == 1 ){
        if (role == "host"){
            res.send (await visitor_list ())
        }
        else
            res.send ("you are not a host")
    }   
    else
        res.send ("you have not login yet")
})

app.post("/register" , async (req, res) => {  //register visitor
    if (req.body.ic.length != 14)
        res.send ("ic number invalid")
    else
        res.send(await registerUser(req.body.ic, req.body.username, req.body.password, req.body.email, req.body.unit_number, req.body.contact))
})

//security api

app.get("/login/security/registration_display" ,verifyToken, async (req, res) => {  //register visitor
    if ((token_state == 1) && (role == "security")) 
        res.send(await registration_display ())
    else
        res.send ("You are not a security")

})

app.post("/login/security/registration_approval" ,verifyToken, async (req, res) => {  //register visitor
    if ((token_state == 1) && (role == "security")) {
        if (req.body.registration_id.length == 24)
            res.send(await host_approval(req.body.registration_id))
        else
            res.send ("Invalid host id")
    }
    else
        res.send ("You are not a security")

})

app.post("/login/security/registration_rejection" ,verifyToken, async (req, res) => {  //register visitor
    if ((token_state == 1) && (role == "security")) {
        if (req.body.rejection_id.length == 24)
            res.send(await host_rejection(req.body.rejection_id))
        else
            res.send ("Invalid host id")
    }
    else
        res.send ("You are not a security")

})

app.get("/login/security/pass_display" ,verifyToken, async (req, res) => {  //register visitor
    if ((token_state == 1) && (role == "security"))
        res.send (await pass_display())
    else
        res.send ("You are not a security")
})

app.post("/login/security/verify_pass" ,verifyToken, async (req, res) => {  //register visitor
    if ((token_state == 1) && (role == "security"))
    {
        if (req.body.reference_id.length == 24)
            res.send(await pass_verification(req.body.reference_id))
        else
            res.send ("Invalid reference id")
    }
    else
        res.send ("You are not a security")
})

app.get("/login/security/visitor_display" ,verifyToken, async (req, res) => {  //register visitor
    if ((token_state == 1) && (role == "security"))
        res.send (await visitor_display ())
    else
        res.send ("You are not a security")
})

app.get("/login/security/host_display" ,verifyToken, async (req, res) => {  //register visitor
    if ((token_state == 1) && (role == "security"))
        res.send (await user_display ())
    else
        res.send ("You are not a security")
})

app.post("/login/security/delete_host" ,verifyToken, async (req, res) => {  //register visitor
    if ((token_state == 1) && (role == "security"))
        if (req.body.id.length == 24)
            res.send (await deleteUser(req.body.id, req.body.username, req.body.email))
        else
            res.send ("Invalid host id")
    else
        res.send ("You are not a security")
})

app.post("/login/security/delete_visitor" ,verifyToken, async (req, res) => {  //register visitor
    if ((token_state == 1) && (role == "security"))
        if (req.body.id.length == 24)
            res.send (await deleteVisitor(req.body.id, req.body.username, req.body.email))
        else
            res.send ("Invalid visitor id")
    else
        res.send ("You are not a security")
})

//admin api

app.post('/login/admin_login',verifyToken, async(req, res) => {   //login
    if(token_state == 0){
        let answer = await login_admin(req.body.username,req.body.password, req.body.secret);
        if (state == 0){
            res.cookie("sessid", jwt_token, {
                httpOnly: true,
            });
        }
        res.status(200).send(answer)
    }
    else{
        res.status(200).send("you had logged in as " + role)
    }
    state = 0
})

app.get ('/login/admin/access', verifyToken, async(req, res) => {
    if ((token_state == 1) && (role == "admin"))
        res.send(await view_database ())
    else
        res.send ("you are not admin")
})

app.post ('/login/admin/change_to_security', verifyToken, async(req, res) => {
    if ((token_state == 1) && (role == "admin")){
        if (req.body.host_id.length == 24)
            res.send(await toSecurityRole(req.body.host_id))
        else
            res.send ("Invalid host id")
    }
    else
        res.send ("you are not admin")
})

app.post ('/login/admin/change_to_host', verifyToken, async(req, res) => {
    if ((token_state == 1) && (role == "admin")){
        if (req.body.security_id.length == 24)
            res.send(await toHostRole(req.body.security_id))
        else
            res.send ("Invalid security id")
    }
    else
        res.send ("you are not admin")
})

app.get('/login/logout', (req, res) => {
        console.log ("logout")
        res.clearCookie("sessid").send("You have log out")
})

app.get('/', (req, res) => {
    res.redirect ("/api-docs");
 })

app.get('/login/user/test',verifyToken, async(req, res) => {   //login
    if(token_state == 0){
        create_jwt ({id: "658c481cb28bf3cc216e5582", role: "host"})
        
        res.cookie("sessid", jwt_token, {
            httpOnly: true,
        });
        
        res.status(200).send(answer)
    }
    else{
        res.status(200).send("you had logged in as " + role)
    }
    state = 0
})

app.get('/login/visitor/test',verifyToken, async(req, res) => {   //login
    if(token_state == 0){
        create_jwt ({id: "658c488bb28bf3cc216e5584", role: "visitor"})
        
        res.cookie("sessid", jwt_token, {
            httpOnly: true,
        });
        
        res.status(200).send(answer)
    }
    else{
        res.status(200).send("you had logged in as " + role)
    }
    state = 0
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

