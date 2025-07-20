const fs = require("fs").promises;
const path = require("path");
const uuid=require("uuid").v4;

async function commitRepo(message){
    let repoPath=path.resolve(process.cwd() , ".myGit");
    let commitPath=path.join(repoPath , "commit");
    let stagingPath=path.join(repoPath , "staging");
    try{
        let commitId=uuid();

        let commitIdDir=path.join(commitPath,commitId);
        await fs.mkdir(commitIdDir , {recursive:true});
        
        let files = await fs.readdir(stagingPath);
        for(let i=0;i<files.length;i+=1){
            await fs.copyFile(path.join(stagingPath , files[i]) , path.join(commitIdDir , files[i]));
        }
        await fs.writeFile(path.join(commitIdDir , "commit.json") , JSON.stringify({message ,date : new Date().toISOString()}));

        console.log(`Commit with id ${commitId} created with message "${message}"`);
    }
    catch(error){
        console.log("Error in commiting file : " , error);
    }
}

module.exports = ({commitRepo});