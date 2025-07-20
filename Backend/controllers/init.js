const fs=require("fs").promises;
const path=require("path");

async function initRepo(){
    let repoPath = path.resolve(process.cwd() , ".myGit");
    let commitPath=path.join(repoPath , "commit");
    try{
        await fs.mkdir(repoPath , {recursive:true});
        await fs.mkdir(commitPath , {recursive:true});
        await fs.writeFile(path.join(repoPath , "config.json") , JSON.stringify({bucket:"s3 bucket"}));
        console.log("Directory was created");
    }
    catch(err){
        console.log("Had error while creating folder!" , err);
    }
}

module.exports = {initRepo};