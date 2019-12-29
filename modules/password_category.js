const mongoose=require('mongoose');
var mongoosePaginate=require('mongoose-paginate');
mongoose.connect('mongodb://localhost:27017/pms',{useNewUrlParser:true,useCreateIndex:true,useUnifiedTopology: true});
var conn=mongoose.Collection;
var passCatSchema=new mongoose.Schema({

	password_category:{
		type:String,
		required:true,
    },
    
    username:{
		type:String,
		required:true,
	},

	date:{
		type:Date,
		default:Date.now
	}
});
passCatSchema.plugin(mongoosePaginate);
var passCatModel=mongoose.model('password_category',passCatSchema);
module.exports=passCatModel;