const fs = require("fs").promises;
const path = require("path");
const {gc , bucketNameStr , GCS_BUCKET} = require("../config/google-cloud-config"); 

async function pushRepo(){
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
        
        // const params = {                         //AWS
        //   // Bucket:bucketNameStr,
        //   // Key:`commits/${}`,
        //   // Body:fileContent
        // };

        await GCS_BUCKET.upload(filePath,{
          destination:`commits/${commitDirs[i]}/${files[j]}`
        })

        
        // await s3.upload(params).promises;               //AWS
      }
    } 
    console.log("All commits pushed successfully!");
  }
  catch(err){
    console.log("Error while pushing : " , err);
  }
}

module.exports={pushRepo};