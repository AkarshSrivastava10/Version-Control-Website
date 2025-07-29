const mongoose=require('mongoose');

const issueSchema=new mongoose.Schema({
    tittle:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    status:{
        type:String,
        emun:["open" , "closed"],
        default:"open",
    },
    repository:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Repository",
    }
});

const Issue=mongoose.model("Issue" , issueSchema);

module.exports=Issue;