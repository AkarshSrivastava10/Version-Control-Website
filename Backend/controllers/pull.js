const fs=require("fs").promises;
const path = require("path");
const {bucketNameStr , GCS_BUCKET , gc}=require("../config/google-cloud-config");

async function pullRepo(userId , repoId , commitId){
  const repoPath=path.resolve(process.cwd() , ".myGit");
  const commitsPath=path.join(repoPath , "commits");
  try{
    
    // const data=await s3.listObjectsV2({   For AWS
    //   Bucket:bucketNameStr,
    //   prefix:"commits/",
    // })

    const [objects] = await GCS_BUCKET.getFiles({
      prefix:`commits/${userId}/${repoId}/${commitId}`
    })
    // console.log(objects);

    // const objects=data.Contents;   // for AWS,IN IT returns directly an array of files and folders
    // for(let object of objects){
    //   // const key = object.key; AWS array has key to return a file but in GCS It has name property
    // }

    for(let object of objects){
      let objectKey=object.name;
      const commitDir=path.join(commitsPath,path.dirname(objectKey).split('/').pop());
      // console.log(commitDir);
      await fs.mkdir(commitDir , {recursive:true}); //TO MAKE NEW FOLDER AT SAME POSITION AND STORE THE PULLED OBJECTS THERE
      
      // AWS
      // const params={
      //   Bucket:bucketNameStr,
      //   Key:objectKey
      // }
      //  const fileContent=await s3.getObject(params);

      let file = GCS_BUCKET.file(objectKey);
      await file.download({
        destination:path.join(repoPath , objectKey),
      })

      console.log("Pull from remote successfully done!");
    }
  }
  catch(err){
    console.log("Error while pulling from remote : " , err);
  }
}

module.exports={pullRepo};