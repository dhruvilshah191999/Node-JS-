var express = require('express');
var userModule=require('../modules/user');
var passCatModule=require('../modules/password_category');
var passDetailsModule=require('../modules/password_details');
var mongoosePaginate=require('mongoose-paginate');
var router = express.Router();  
var bcrypt=require('bcryptjs');
var jwt=require('jsonwebtoken');
const {check,validationResult}=require('express-validator');

if(typeof localStorage==="undefined" || localStorage===null){
  var LocalStorage=require('node-localstorage').LocalStorage;
  localStorage=new LocalStorage('./scratch');
}

function chechloginuser(req,res,next){
  var userToken=localStorage.getItem('userToken');
  try{
      var decoded=jwt.verify(userToken,'loginToken');
  }
  catch{
    res.redirect('/');
  }
  next();
}

function checkemail(req,res,next){
  var email=req.body.email;
  var checkexitemail=userModule.findOne({email:email});
  checkexitemail.exec((err,data)=>{
    if(err) throw err;
    if(data){
      return res.render('signup', { title: 'Password Management System',msg:'Email Alerady Exit' });
    }
    next();
  })
}

function checkuser(req,res,next){
  var username=req.body.username;
  var checkexituser=userModule.findOne({username:username});
  checkexituser.exec((err,data)=>{
    if(err) throw err;
    if(data){
      return res.render('signup', { title: 'Password Management System',msg:'Username Alerady Exit' });
    }
    next();
  })
}
function checkuserlogin(req,res,next){
  var username=req.body.username;
  var checkexituser=userModule.findOne({username:username});
  checkexituser.exec((err,data)=>{
    if(err) throw err;
    if(!data){
      return res.render('index', { title: 'Password Management System',msg:'Invalid Username' });
    }
    next();
  })
}

router.get('/',chechloginuser, function(req, res, next) {
    var loginUser=localStorage.getItem('loginUser');
    var passCatDetails=passCatModule.find({username:loginUser});
    passCatDetails.exec(function(err,data){
      if(err) throw err;
      res.render('addnewPassword', { title: 'Password Management System',loginUser:loginUser,records:data });
    }); 
  });
  
  router.post('/',chechloginuser, function(req, res, next) {
    var loginUser=localStorage.getItem('loginUser');
    var passCategory=req.body.pass_cat;
    var projectname=req.body.project_name;
    var passDetails=req.body.passwordcategory;
    var pass_Details=new passDetailsModule({
      username:loginUser,
      password_category:passCategory,
      project_name:projectname,
      password_details:passDetails
    });
    pass_Details.save(function(err,data){
      if(err) throw err;
      res.redirect('/view-password');
    }); 
  });
  

module.exports = router;