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
    /*var options={offset:1,limit:3};
    passCatModule.paginate({username:loginUser},options).then(function(result){
      console.log(result);
      res.render('password_category', { title: 'Password Management System',loginUser:loginUser,records:result.docs,current:result.offset,pages:Math.ceil(result.total/result.limit)});
    });*/ //Proper Answer Not Coming
    
    var perpage=5;
    var page=req.params.page || 1;
    var pass_Detail=passCatModule.find({username:loginUser});
    pass_Detail.skip((perpage*page)-perpage).limit(perpage).exec(function(err,data){
      if(err) throw err;
      passCatModule.countDocuments({username:loginUser}).exec((err,count)=>{
      res.render('password_category', { title: 'Password Management System',loginUser:loginUser,records:data,current:page,pages:Math.ceil(count/perpage)});
      });
    });  
  });
  
  router.get('/:page',chechloginuser, function(req, res, next) {
    var loginUser=localStorage.getItem('loginUser');
    var perpage=5;
    var page=req.params.page || 1;
    var pass_Detail=passCatModule.find({username:loginUser});
    pass_Detail.skip((perpage*page)-perpage).limit(perpage).exec(function(err,data){
      if(err) throw err;
      passCatModule.countDocuments({username:loginUser}).exec((err,count)=>{
      res.render('password_category', { title: 'Password Management System',loginUser:loginUser,records:data,current:page,pages:Math.ceil(count/perpage)});
      });
    });  
  });
  
  router.get('/delete/:id',chechloginuser, function(req, res, next) {
    var loginUser=localStorage.getItem('loginUser');
    var passid=req.params.id;
    var passCatDelete=passCatModule.findByIdAndDelete(passid);
    passCatDelete.exec(function(err,data){
      if(err) throw err;
      res.redirect('/password-category');
    });
  });
  
  router.get('/edit/:id',chechloginuser, function(req, res, next) {
    var loginUser=localStorage.getItem('loginUser');
    var passid=req.params.id;
    var getpassCat=passCatModule.findById(passid);
    getpassCat.exec(function(err,data){
      if(err) throw err;
      res.render('edit_category_password', { title: 'Password Management System',loginUser:loginUser,errors:'',success:'',records:data,id:passid});
    });
  });
  
  router.post('/edit',chechloginuser,function(req, res, next) {
    var loginUser=localStorage.getItem('loginUser');
    var passCat=req.body.categoryname;
    var passid=req.body.id;
    var passUpdate=passCatModule.findByIdAndUpdate(passid,{password_category:passCat})
    passUpdate.exec(function(err,data){
      if(err) throw err;
       res.redirect('/password-category');
    });
  });
  

module.exports = router;