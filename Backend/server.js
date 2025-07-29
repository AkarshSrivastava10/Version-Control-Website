require('dotenv').config();

const yargs=require('yargs');
const {hideBin}=require('yargs/helpers');
const {initRepo} = require("./controllers/init");
const {addRepo} = require("./controllers/add");
const {commitRepo} = require("./controllers/commit");
const {pullRepo} = require("./controllers/pull");
const {pushRepo} = require("./controllers/push");
const {revertRepo} = require("./controllers/revert");

const express=require('express');
const cors=require('cors');
const mongoose=require('mongoose');
const bodyParser=require('body-parser');
const http=require('http');
const {Server} = require('socket.io'); 
const mainRouter = require('./routes/mainRoute');



yargs(hideBin(process.argv))
.command("start" , "To start a new server" , {} , startServer)
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
} , (argv)=>{
    revertRepo(argv.commitId);
})
.command("push" , "To push the remote repository" , {} , pushRepo)
.command("pull" , "To pull from the remote repository" , {} , pullRepo)

.demandCommand(1 , "You need atleast one command!").help().argv; //{} is parameter list



function startServer(){
    const app=express();
    const port=process.env.PORT;

    app.use(bodyParser.json());
    app.use(express.json());

    //cors
    app.use(cors({origin:'*'})); //for dev phase "*"
    
    //Database
    const mongoUri=process.env.MONGO_URI;

    async function main(){
        await mongoose.connect(mongoUri);
    }

    main()
    .then(()=>{
        console.log("Connected to the mongoDB server!");
    })
    .catch((err)=>{
        console.log(`Some error in connecting to mongoDB : ${err}`);
    })  

    //main code
    app.use("/" , mainRouter);    

    const user = "testUser";

    const httpServer=http.createServer(app);  //To setup a server but not initialzing it
    const io = new Server(httpServer , {      //Brain of server,telling socket io to not creat a diff server
        cors:{
            origin:"*",
            methods:["GET" , "POST"]
        }
    });

    io.on("connection" , (socket)=>{         //setting up a asocket server,definfing hoe server will react to event from client
        //socket is a indivial client socket connection
        socket.on('joinRoom' , (userId)=>{  //joinRoom is some event that is being run with userId data of individual user
            user=userId;
            console.log("=====");
            console.log(user);
            console.log("======");
        })
    })
 
    const db=mongoose.connection;
    db.once("open" , async()=>{
        console.log('CRUD operations called');
        //CRUD operations
    })

    httpServer.listen(port , ()=>{
        console.log(`Server is listening on port ${port}`);
    })
}

