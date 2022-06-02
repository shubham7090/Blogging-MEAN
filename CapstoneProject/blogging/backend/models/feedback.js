const mongoose = require("mongoose");

const feedbackSchema=mongoose.Schema({
    rating:{type:Number,required:true},
    content:{type:String,required:true},
    author:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true},
});

module.exports=mongoose.model('Feedback',feedbackSchema);