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
    var perpage=1;
    var page=req.params.page || 1;
    var pass_Detail=passDetailsModule.find({username:loginUser});
    pass_Detail.skip((perpage*page)-perpage).limit(perpage).exec(function(err,data){
      if(err) throw err;
      passDetailsModule.countDocuments({username:loginUser}).exec((err,count)=>{
      res.render('viewallPassword', { title: 'Password Management System',loginUser:loginUser,records:data,current:page,pages:Math.ceil(count/perpage)});
      });
    });  
  });
  
  router.get('/:page',chechloginuser, function(req, res, next) {
    var loginUser=localStorage.getItem('loginUser');
    var perpage=1;
    var page=req.params.page || 1;
    var pass_Detail=passDetailsModule.find({username:loginUser});
    pass_Detail.skip((perpage*page)-perpage).limit(perpage).exec(function(err,data){
      if(err) throw err;
      passDetailsModule.countDocuments({username:loginUser}).exec((err,count)=>{
      res.render('viewallPassword', { title: 'Password Management System',loginUser:loginUser,records:data,current:page,pages:Math.ceil(count/perpage)});
      });
    });  
  });
  
  router.get('/delete/:id',chechloginuser, function(req, res, next) {
    var loginUser=localStorage.getItem('loginUser');
    var passid=req.params.id;
    var passCatDelete=passDetailsModule.findByIdAndDelete(passid);
    passCatDelete.exec(function(err,data){
      if(err) throw err;
      res.redirect('/view-password');
    });
  });
  
  router.get('/edit/:id',chechloginuser, function(req, res, next) {
    var loginUser=localStorage.getItem('loginUser');
    var passid=req.params.id;
    var getpassCat=passDetailsModule.findById(passid);
    getpassCat.exec(function(err,data){
      if(err) throw err;
      var pass_Detail=passDetailsModule.find({username:loginUser});
      pass_Detail.exec(function(err1,data1){
        if(err1) throw err1;
        res.render('edit_password', {title: 'Password Management System',loginUser:loginUser,errors:'',success:'',records:data,id:passid,records1:data1});
      });   
    });
  });
  
  router.post('/edit/',chechloginuser, function(req, res, next) {
    var loginUser=localStorage.getItem('loginUser');
    var passid=req.body.id;
    var passCategory=req.body.pass_cat;
    var projectname=req.body.project_name;
    var passDetails=req.body.passwordcategory;
    var passUpdate=passDetailsModule.findByIdAndUpdate(passid,{password_category:passCategory,project_name:projectname,password_details:passDetails})
    passUpdate.exec(function(err,data){
      if(err) throw err;
       res.redirect('/view-password');
    });
  });


module.exports = router;