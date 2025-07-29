const mongoose=require('mongoose');
const Issue=require('../models/issueModel');
const Repository=require('../models/repoModel');
const User=require('../models/userModel');

const createIssue=async(req,res)=>{
    const {tittle , description}=req.params;
    const {id}=req.params; //This is repository id
    try{
        const newIssue = new Issue({
            tittle,
            description, 
            repository:id
        });

        const result=await newIssue.save();
        if(!result){
            return res.status(400).send("Something went wrong while raising the issue from client side!");
        }

        res.status(201).send("New issue raised and open!");
    }
    catch(err){
        console.error("Error while raising the new issue : " , err);
        res.status(500).send("Something went wrong while raising the issue!");
    }
}
const updateIssueById=async(req,res)=>{
    const {id}=req.params; //Issue id
    const {tittle , description , status}=req.body;
    try{
        const updatedIssue=await Issue.findByIdAndUpdate({_id : id} , {tittle , description , status});
        if(!updatedIssue){
            return res.status(404).send("Issue not found in database!");
        }
        await updatedIssue.save();

        res.send(`Issue with ${updateIssueById.tittle} is successfully updaated!`);
    }
    catch(err){
        console.error("Error while updating the issue : " , err);
        res.status(500).send("Something went wrong while updating the issue!");
    }
}
const deleteIssueById=async(req,res)=>{
    const {id}=req.params; //Issue id
    try{
        const deleteIssue = await Issue.findByIdAndDelete({_id : id});
        if(!deleteIssue){
            return res.status(404).send("Issue not found in database!");
        } 
        res.send("Issue successfully closed and deleted!");
    }
    catch(err){
        console.error("Error while deleting issue : " , err);
        res.status(500).send("Something went wrong while deleting issue!");
    }
}
const getAllIssues=async(req,res)=>{
    const {id}=req.params; //Id for the repository
    try{   
        const issueData=await Issue.find({repository : id});
        if(!issueData){
            return res.status(404).send("Issue not found!");
        }
        res.send(`Issues in repository ID ${id} fetched successfully!`);
    }
    catch(err){
        console.error("Error while fetching issue!" , err);
        res.status(5000).send("Something went wrong while fetching the issue information!");
    }
}
const getIssueById=async(req,res)=>{
    const {id}=req.params; //Issue id
    try{
        const issueData=await Issue.findById({_id : id});
        if(!issueData){
            return res.status(404).send("Issue not found!");
        }

        res.send(`Issue with ID ${id} retrieved!`);
    }
    catch(err){
        console.error("Error while fetching issue!" , err);
        res.status(5000).send("Something went wrong while fetching the issue information!");
    }
}

module.exports={
    createIssue,
    updateIssueById,
    deleteIssueById,
    getAllIssues,
    getIssueById
}
