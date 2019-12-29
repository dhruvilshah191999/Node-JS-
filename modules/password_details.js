const mongoose=require('mongoose');
mongoose.connect('mongodb://localhost:27017/pms',{useNewUrlParser:true,useCreateIndex:true,useUnifiedTopology: true});
var conn=mongoose.Collection;
var passDetailsSchema=new mongoose.Schema({

	username:{
		type:String,
		required:true,
	},

	password_category:{
		type:String,
		required:true,
	},

	project_name:{
		type:String,
		required:true,
	},

	password_details:{
		type:String,
		required:true
	},

	date:{
		type:Date,
		default:Date.now
	}
});

var passDetailsModel=mongoose.model('password_details',passDetailsSchema);
module.exports=passDetailsModel;