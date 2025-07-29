const mongoose = require("mongoose");

let userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
    },
    repositories:[{
        default:[],
        type:mongoose.Schema.Types.ObjectId,
        ref:"Repository"
    }],
    followedUser:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        default:[]
    }],
    starRepos:{
        default:[],
        type:mongoose.Schema.Types.ObjectId,
        ref:"Repository"
    }
});

const User=mongoose.model("User" , userSchema);

module.exports = User; 
