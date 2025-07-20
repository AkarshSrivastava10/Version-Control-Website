const yargs=require('yargs');
const {hideBin}=require('yargs/helpers');
const {initRepo} = require("./controllers/init");
const {addRepo} = require("./controllers/add");
const {commitRepo} = require("./controllers/commit");
const {pullRepo} = require("./controllers/pull");
const {pushRepo} = require("./controllers/push");
const {revertRepo} = require("./controllers/revert");
require('dotenv').config();

yargs(hideBin(process.argv))
.command("init" , "To initialize a new repository" , {} , initRepo)
.command("add <filename>" , "Add a file to the repository" , (yargs)=>{
    return yargs.positional("file" , {
        describe:"File add to the stagging area",
        type:"string",
    })
} , (argv)=>{
    // console.log(argv);
    addRepo(argv.filename);
})
.command("commit <msg>" , "To commit the changes/addition" , (yargs)=>{
    return yargs.positional("msg" , {
        describe:"Message for the commit",
        type:"string",
    })
} , (argv)=>{
    commitRepo(argv.msg);
})
.command("revert [commitId]" , "To revert to the particular commit" , (yargs)=>{
    return yargs.positional("commitId" , {
        describe:"Id for the commit",
        type:"string",
    })
} , revertRepo)
.command("push" , "To push the remote repository" , {} , pushRepo)
.command("pull" , "To pull from the remote repository" , {} , pullRepo)

.demandCommand(1 , "You need atleast one command!").help().argv; //{} is parameter list