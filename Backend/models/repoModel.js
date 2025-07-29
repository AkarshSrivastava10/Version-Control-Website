const mongoose = require('mongoose');

const repositorySchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true
    },
    description:{
        type:String,
    },
    content:[{  //Can be the list of files
        type:String,
    }],
    visibility:{
        type:Boolean,
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    issues:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Issue"
    }]
});

const Repository=mongoose.model("Repository" , repositorySchema);

module.exports = Repository;