const express=require('express');
const mainRouter=express.Router();

const userRouter = require('./userRoute');
const repoRouter=require('./repoRouter');
const issueRouter=require('./issueRouter');

mainRouter.use(userRouter);
mainRouter.use(repoRouter);
mainRouter.use(issueRouter);

mainRouter.get("/" , (req,res)=>{
    res.send("This is root page!");
});

module.exports=mainRouter;