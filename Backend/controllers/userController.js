const jwt=require('jsonwebtoken');
const mongoose=require('mongoose');
const bcrypt=require('bcryptjs');
const User = require('../models/userModel');
require('dotenv').config();

const getAllUsers=async (req,res)=>{
    try{
        const users=await User.find();
        console.log(users);
        res.json(users);
    }
    catch(err){
        console.log("Error while fetching user details : " , err);
        res.status(500).send('Server had some issue!');
    }
}
const signup=async(req,res)=>{
    let {username , email , password} = req.body;
    try{
        const user = await User.findOne({email:email});
        if(user){
            return res.status(400).json({message : "User already exist!"});
        }

        const salt=await bcrypt.genSalt(10);
        let hashedPassword=await bcrypt.hash(password , salt);

        const newUser=await new User({
            username,
            email,
            hashedPassword,
            repositories:[],
            followedUser:[],
            starRepos:[] 
        });
        const result=await newUser.save();
        const token=jwt.sign({id:result._id} , process.env.JWT_SECRET_KEY , {expiresIn:"1h"});
        res.json({token , userId:result._id});
    }
    catch(err){
        console.error("Error during signup : " , err);
        res.status(500).send("Server error");
    }
}
const login=async(req,res)=>{
    const {email , password}=req.body;
    try{

        const user=await User.findOne({email});
        if(!user){
            return res.status(400).json({message : "Invalid credentials!"}); //User doesn't exists
        }
        
        const isPassMatch=await bcrypt.compare(password , user.hashedPassword);

        if(!isPassMatch){
            return res.status(400).json({message:"Invalid credentials!"});
        }

        const token=jwt.sign({id:user._id} , process.env.JWT_SECRET_KEY , {expiresIn:"1h"});

        res.json({token:token , userId : user._id});
    }
    catch(err){
        console.log("Error during login : " , err);
        res.status(500).send("Something went wrong!");
    }
}
const getUserProfile=async(req,res)=>{
    const {userId} = req.params;
    try{
        
        const userData=await User.findOne({_id:userId}).populate("repositories"); //here string will be converted to mongo db compatible
        
        if(!userData){
            return res.status(400).json({message : "User not found!"});
        } 

        res.json(userData);
    }
    catch(error){
        console.error("Error while fetching user! : " , error);
        res.status(500).send("Something went wrong in server!");
    }
}
const updateUserProfile=async(req,res)=>{
    let {id}=req.params;
    let {email , password}=req.body;
    try{

        const updatedFeilds={email};
        if(password){
            const salt=await bcrypt.genSalt(10);
            const newPass=await bcrypt.hash(password , salt);
            updatedFeilds.newPass=newPass;
        }
        const findUser=await User.findByIdAndUpdate({_id:id} , {email:updatedFeilds.email , hashedPassword:updatedFeilds.newPass});
        await findUser.save();
        
        res.status(200).json({msg : "feilds updated!"});

    }
    catch(err){
        console.error("Error while updating user info!" , err);
        res.status(500).send("Something went wrong in updating user!");
    }
}
const deleteUserProfile=async (req,res)=>{
    const {id}=req.params;
    try{

        const result = await User.findByIdAndDelete({_id:id});
        if(!result){
            return res.status(404).send("User not found!");
        }
        res.status(200).send(`User is deleted`);
    }
    catch(err){
        console.error("Error while deleting user : " , err);
        res.status(500).send("Something went wrong while deleting user!");
    }
}

module.exports={getAllUsers , signup , login , getUserProfile , updateUserProfile , deleteUserProfile};