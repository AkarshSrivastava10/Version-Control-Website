const fs=require('fs');
const path=require('path');
const {promisify}=require("util");

const readdir=promisify(fs.readdir); 
const copyFile=promisify(fs.copyFile); 

async function revertRepo(commitId){
  const repoPath=path.resolve(process.cwd() , ".myGit");
  const commitsRepo=path.join(repoPath , "commits");
  try{
    let commitDir=path.join(commitsRepo , commitId);
    let parentDir = path.resolve(repoPath , "..");
    let files=await readdir(commitDir); //Whether the commit ID exists in real
    for(let i=0;i<files.length;i+=1){
      await copyFile(path.join(commitDir , files[i]) , path.join(parentDir , files[i]));
    }

    console.log(`Reverted to the commit ${commitId}`);
  }
  catch(err){
    console.log("Unable to revert...Check the commit ID again! \n error : " , err);
  }
}

module.exports = {revertRepo};