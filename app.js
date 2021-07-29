// jshint esversion:6

require("dotenv").config();
const express = require("express")
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const bcrypt = require("bcrypt")
const saltRounds = 10

const app = express()
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static("public"))

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true, useUnifiedTopology: true})

const userSchema = new mongoose.Schema({
    email: String,
    password: String
})

// this is for encryption


// 

const User = mongoose.model("User", userSchema)

app.get("/", function(req, res){
    res.render("home")
})

app.get("/login", function(req, res){
    res.render("login")
})

app.post("/login", function(req, res){

    User.findOne({email: req.body.username}, function(err, foundUser){
        if(!err){
            if(foundUser){
                bcrypt.compare(req.body.password, foundUser.password, function(err, result){
                    if(result === true){
                        res.render("secrets");
                    }
                });
            }
        }
        else{
            res.send(err)
        }
    })
})

app.get("/register", function(req, res){
    res.render("register")
})

app.post("/register", function(req, res){

    bcrypt.hash(req.body.password, saltRounds, function(err, hash){
        const newUser = new User({
            email: req.body.username,
            password: hash
        })
    
        newUser.save(function(err){
            if(!err){
                res.render("secrets")
            }
            else{
                res.send(err)
            }
        })
    })

})

app.listen(3000, function(){
    console.log("Server started at port 3000")
})