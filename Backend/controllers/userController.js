const jwt=require('jsonwebtoken');
const { MongoClient, ObjectId, ServerHeartbeatStartedEvent, ReturnDocument } = require('mongodb');
const bcrypt=require('bcryptjs');
const { estimatedDocumentCount } = require('../models/userModel');
const objectId=require('mongodb').ObjectId;
require('dotenv').config();

//db connection
const uri=process.env.MONGO_URI;
let client;
async function connectClient(){
    if(!client){
        client=new MongoClient(uri);
        await client.connect();
    }
}

const getAllUsers=async (req,res)=>{
    try{
        await connectClient();
        const db=client.db('projectmygithub');
        const userCollection=db.collection('users');

        const users=await userCollection.find({}).toArray();
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
        await connectClient(); //To connect with the mongo client 
        const db=client.db("projectmygithub"); //To connect with the dbs 
        const userCollection=db.collection('users'); //To go to collection name
        const user = await userCollection.findOne({username});
        if(user){
            return res.status(400).json({message : "User already exist!"});
        }

        const salt=await bcrypt.genSalt(10);
        hashedPassword=await bcrypt.hash(password , salt);
        const newUser={
            username,
            email,
            hashedPassword,
            repositories:[],
            followedUser:[],
            starRepos:[], 
        }

        const result=await userCollection.insertOne(newUser);
        const token=jwt.sign({id:result.insertId} , process.env.JWT_SECRET_KEY , {expiresIn:"1h"});
        res.json({token});
    }
    catch(err){
        console.error("Error during signup : " , err);
        res.send(500).send("Server error");
    }
}
const login=async(req,res)=>{
    const {email , password}=req.body;
    try{
        await connectClient(); 
        const db=client.db("projectmygithub");
        const userCollection=db.collection("users");

        const user=await userCollection.findOne({email});
        
        if(!user){
            return res.status(400).json({message : "Invalid credentials!"}); //User doesn't exists
        }
        
        const isPassMatch=await bcrypt.compare(password , user.hashedPassword);

        if(!isPassMatch){
            return res.status(400).json({message:"Invalid credentials!"});
        }

        const token=jwt.sign({id:user._id} , process.env.JWT_SECRET_KEY , {expiresIn:"1h"});

        res.json({token , userId : user._id});
    }
    catch(err){
        console.log("Error during login : " , err);
        res.status(500).send("Something went wrong!");
    }
}
const getUserProfile=async(req,res)=>{
    const {id} = req.params;
    try{
        await connectClient();
        const db=client.db('projectmygithub');
        const userCollection=db.collection("users");
        
        const userData=await userCollection.findOne({_id:new ObjectId(id)}); //here string will be converted to mongo db compatible
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
        let updateFeilds={email}; //we atleaast nedded email for any kind of updation
        if(password){ //Checkeing if password is updated or not
            const salt=await bcrypt.genSalt(10);
            const hashedPassword=await bcrypt.hash(password , salt);
            updateFeilds.password=hashedPassword;
        }

        // main
        await connectClient();
        const db = client.db("projectmygithub");
        const userCollection=db.collection("users");
        
        const result =await userCollection.findOneAndUpdate({_id:new ObjectId(id)},{$set:updateFeilds},{returnDocument:"after"});
        
        if(!result){
            return res.status(404).json({message:"User not found"});
        }
        return res.send(result);

    }
    catch(err){
        console.error("Error while updating user info!" , err);
        res.send(500).send("Something went wrong in updating user!");
    }
}
const deleteUserProfile=async (req,res)=>{
    const {id}=req.params;
    try{
        await connectClient();
        const db=client.db("projectmygithub");
        const userCollection=db.collection("users");

        const result = await userCollection.deleteOne({_id:new ObjectId(id)});
        if(!result){
            return res.status(404).send("User not found!");
        }
        res.send(`User is deleted`);
    }
    catch(err){
        console.error("Error while deleting user : " , err);
        res.status(500).send("Something went wrong while deleting user!");
    }
}

module.exports={getAllUsers , signup , login , getUserProfile , updateUserProfile , deleteUserProfile};