//jshint esversion:6
require('dotenv').config();
const bodyParser = require("body-parser");
const express=require("express");
const ejs=require("ejs");
const app=express();
// const md5=require("md5");
const bcrypt=require("bcrypt");
const saltRounds=10;
const mongoose=require("mongoose");
// const encrypt=require("mongoose-encryption");
mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser:true});
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine','ejs');
app.use(express.static("public"));

const userSchema=new mongoose.Schema({
      email:String,
      password:String
})



// userSchema.plugin(encrypt,{secret:process.env.SECRET, encryptedFields: ['password']});
const User=new mongoose.model("user",userSchema);


app.get("/",function(req,res){
      res.render("home");
})

app.get("/login",function(req,res){
      res.render("login");
})

app.get("/register",function(req,res){
      res.render("register");
})

app.post("/register",function(req,res){
      bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
            // Store hash in your password DB.
            const user=new User({
                  email:req.body.username,
                  password:hash
            });
            user.save();
            res.render("home"); 
        });
        
      
})
app.post("/login",function(req,res){
      const username=req.body.username;
      const password=req.body.password;
      User.findOne({email:username}).then(function(data){
            if(data){
                  bcrypt.compare(password, data.password, function(err, result) {
                        if(result == true){
                              res.render("secrets");
                        }
                        else{
                              res.send("pass didn't match");
                        }
                        
                    });
            }
            else{
                  res.send("email didn't match");
            }
      }).catch(function(err){
            console.log(err);
      })
})

app.listen(3000,function(){
      console.log("ok");
})