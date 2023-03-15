// requiring modules that are needed
const express = require("express")
const bodyParser= require("body-parser")
const https = require("https")
require("dotenv").config()
// accessing keys hidden
const MY_API_KEY = process.env.API_KEY
const MY_LIST_ID = process.env.LIST_ID
const MY_API_SERVER = process.env.API_SERVER
// Initializing an express app.
const app = express()
// use body-parser 
app.use(bodyParser.urlencoded({extended: true}));

// this line permits the css external to load
app.use(express.static(__dirname));

// sending the signup page to the browser 
app.get("/", function(req, res){
    res.sendFile(__dirname + "/signup.html")
})

// As soon as the sign me up button is pressed, execute this
app.post("/", function(req, res){
   var firstName = req.body.fName
   var lastName = req.body.lName
   var email = req.body.email
// Uploads data to the server
   var data = {
    members: [
        {
            email_address: email,
            status: "subscribed",
            merge_fields:{
                FNAME: firstName,
                LNAME: lastName
            }
        }
    ]
   }

   var jsonData = JSON.stringify(data)
   const url = `https://${MY_API_SERVER}.api.mailchimp.com/3.0/lists/${MY_LIST_ID}`
   const options = {
    method:"POST",
    auth:`alvarezmike:${MY_API_KEY}`
   }
   const request = https.request(url, options, function(response){
    if (response.statusCode === 200){
        res.sendFile(__dirname + "/success.html")
    }
    else{
        res.sendFile(__dirname + "/failure.html")

    }

    response.on("data",function(data){
        console.log(JSON.parse(data))
    })
   })

   request.write(jsonData)
   request.end()
})

//if form fails, allow user to be re-directed to home page by pressing the try again button
app.post("/failure", function(req, res){
    res.redirect("/")
})

// port for local development
app.listen(process.env.PORT || 3000, function(){
    console.log("Active on port -> 3000")
})
