const mongoose=require("mongoose");
const Repository=require('../models/repoModel');
const Issue=require('../models/issueModel');
const User=require('../models/userModel');
const { ConnectionPoolMonitoringEvent } = require("mongodb");
const { GCS_BUCKET , gc , bucketNameStr } = require("../config/google-cloud-config");


const createRepo=async(req,res)=>{
    const {name , description , content , visibility , owner , issues}=req.body;
    try{
        if(!name){
            return res.status(400).json({err : "Repository name is required!"});
        }
        const ownerDetails=await User.findById({_id:owner});
        if(!mongoose.Types.ObjectId.isValid(owner) && ownerDetails){     ///Here we just checking that the owner (id) is in corrent form of mongodb id ie 24bit hexadecimal
            return res.status(400).json({err : "Invalid user ID!"});
        }
        
        const newRepo=new Repository({
            name,
            description,
            content,
            visibility,
            owner,
            issues
        });

        const result=await newRepo.save(); //For saving changes
        const saveRepo=await User.findByIdAndUpdate({_id:owner},{repositories:result._id});

        console.log(saveRepo);

        res.status(201).json({msg : "New repository created!" , repositoryId : result._id});

    }
    catch(err){
        console.error("Error in creating repository : " , err);
        res.status(500).send("Something went wrong in creating repository!");
    }
}
const getAllRepo=async (req,res)=>{
    try{
        let data=await Repository.find().populate("owner").populate("issues");
        
        res.send(data);
    }
    catch(err){
        console.error("Error while fetching all repository : " , err);
        res.status(500).send("Something went wrong while ")
    }
}

const fetchRepoById=async(req,res)=>{
    const {id}=req.params;
    try{
        const data=await Repository.findById({_id : id});
        if(!data){
            return res.status(404).send("Repository does not exists!");
        }
        res.send(data);
    }
    catch(err){
        console.error('Error while fetching repositort data! : ' , err);
        res.status(500).send('Something went wrong while fetching data!');
    }
}
const fetchRepoByName=async(req,res)=>{
    const repoName=req.params.name;
    try{
        const data=await Repository.find({name : repoName});
        if(!data){
            return res.status(404).send("Repository does not exists!");
        }
        res.send(data);
    }
    catch(err){
        console.error('Error while fetching repositort data! : ' , err);
        res.status(500).send('Something went wrong while fetching data!');
    }
}
const fetchRepoForCurrUser=async(req,res)=>{
    const {userId}=req.params;
    // console.log(userId);
    try{
        const repositories=await Repository.find({owner : userId});
        // console.log(repositories);
        if(!repositories || repositories.length===0){
            return res.status(404).json({msg : "Not found"});
        }

        res.json(repositories);
    }
    catch(err){
        console.error("Something went wrong while fetching data : " , err);
        res.status(500).send('Something went wrong!');
    }
}
const updateRepoById=async(req,res)=>{
    const {id}=req.params;
    const{name , content , description}=req.body;
    try{
        const result=await Repository.findByIdAndUpdate({_id:id},{name,content,description});
        if(!result){
            return res.status(404).sned("Repository not found!");
        }
        await result.save();
        res.send("Repository was updated successfully!");
    }
    catch(err){
        console.error("Error in updating the repository : " , err);
        res.status(500).send("Something went wrong while updating repository!");
    }
}
const deleteRepoById=async(req,res)=>{
    const {id}=req.params;
    try{
        const result=await Repository.findByIdAndDelete({_id:id});
        if(!result){
            return res.status(404).sned("Repository not found!");
        }
        res.send("Repository was deleted successfully!");
    }
    catch(err){
        console.error("Error in deleting the repository : " , err);
        res.status(500).send("Something went wrong while deleting repository!");
    }
}
const toggleVisibilityById=async(req,res)=>{
    const {id}=req.params;
    try{
        const repoData = await Repository.findById({_id : id});
        if(!repoData){
            return res.status(404).sned("Repository not found!");
        }
        repoData.visibility=!repoData.visibility;
        await repoData.save();

        res.send("Repository visibility was changed!");
    }
    catch(err){
        console.error("Error while changing repository visibility : " , err);
        res.status(500).send("Something went wrong while changing repository visibility");
    }
}
const getRepoContent=async(req,res)=>{
    const {repoId}=req.params;
    const {userId}=req.query;
    try{
        const gcsPrefix=`commits/${userId}/${repoId}/`
        const [filesFromGcs]=await GCS_BUCKET.getFiles({prefix:gcsPrefix});
        console.log(filesFromGcs);
        filesFromGcs.sort((a, b) => new Date(b.metadata.updated) - new Date(a.metadata.updated));
        const latestFile = filesFromGcs[0];
        console.log(latestFile);
        const pathParts = latestFile.name.split('/');
        console.log(pathParts);
        const latestCommitId = pathParts[3];
        // console.log(latestCommitId);
        const latestCommitPrefix = `commits/${userId}/${repoId}/${latestCommitId}`;
        const [filesInLatestCommitId]=await GCS_BUCKET.getFiles({prefix:latestCommitPrefix});
        // console.log(filesInLatestCommitId);
        const fileLinks = await Promise.all(
            filesInLatestCommitId.map(async (filePath) => {
                const options = {
                    version: 'v4',
                    action: 'read',
                    expires: Date.now() + 15 * 60 * 1000,
                };
                const [url] = await GCS_BUCKET.file(filePath).getSignedUrl(options);
                return url;
            })
        );
        console.log(fileLinks);
        const updatedRepo = await Repository.findByIdAndUpdate(
            {_id : repoId},
            {
                latestCommit: latestCommitId,
                content: fileLinks, // Store the signed URLs
                updatedAt: new Date(),
            }
        );
    }
    catch(err){
        console.error("Error while getting the content of repository : " , err);
        res.status(500).json({msg:"Something went wrong!" , error:err});
    }
}

module.exports={
    createRepo,
    getAllRepo,
    fetchRepoById,
    fetchRepoByName,
    fetchRepoForCurrUser,
    updateRepoById,
    deleteRepoById,
    toggleVisibilityById,
    getRepoContent
}
