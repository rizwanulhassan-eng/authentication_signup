//jshint esversion:6
require('dotenv').config();
const bodyParser = require("body-parser");
const express=require("express");
const ejs=require("ejs");
const app=express();
const mongoose=require("mongoose");
const encrypt=require("mongoose-encryption");
mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser:true});
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine','ejs');
app.use(express.static("public"));

const userSchema=new mongoose.Schema({
      email:String,
      password:String
})



userSchema.plugin(encrypt,{secret:process.env.SECRET, encryptedFields: ['password']});
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
      const user=new User({
            email:req.body.username,
            password:req.body.password
      });
      user.save();
      res.render("home"); 
})
app.post("/login",function(req,res){
      const username=req.body.username;
      const password=req.body.password;
      User.findOne({email:username}).then(function(data){
            if(data){
                  if(data.password===password){
                        res.render("secrets");
                  }
                  else{
                        res.send("pass didn't match");
                  }
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