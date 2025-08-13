const fs = require("fs").promises;
const path = require("path");
const {gc , bucketNameStr , GCS_BUCKET} = require("../config/google-cloud-config"); 
// const mongoose=require("mongoose");
// const User=require("../models/userModel");
// const Repository=require("../models/repoModel");
// const mongoose=require('mongoose');
 

async function pushRepo(userId , repoId){
  let repoPath = path.resolve(process.cwd() , ".myGit");
  let commitsPath=path.join(repoPath , "commits");
  try{
    const commitDirs=await fs.readdir(commitsPath); //commitDir means the uuid foldername
    for(let i=0;i<commitDirs.length;i+=1){
      let commitDirPath=path.join(commitsPath , commitDirs[i]);
      let files=await fs.readdir(commitDirPath); //returning an array of files
      // console.log(files);
      for(let j=0;j<files.length;j+=1){
        
        let filePath=path.join(commitDirPath , files[j]);

        await GCS_BUCKET.upload(filePath,{
          destination:`commits/${userId}/${repoId}/${commitDirs[i]}/${files[j]}`
        });
      }
    } 
    
    console.log("All commits pushed successfully!");

  }
  catch(err){
    console.log("Error while pushing : " , err);
  }
}

module.exports={pushRepo};