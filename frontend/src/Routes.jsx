import React , {useEffect} from "react";
import {useNavigate , useRoutes} from 'react-router-dom';

// Pages list

import Dashboard from './components/dashboard/Dashboard';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import Profile from './components/user/Profile';
import RepoPage from "./components/repo/RepoPage";

//Authcontext
import { useAuth } from "./components/authContext";

const ProjectRoutes=()=>{
    const{currUser , setCurrUser} = useAuth(); //Here the context is being used
    const navigate=useNavigate();

    useEffect(()=>{  //It is for first time rendering and for an changes to the extra agruments in useEffect
        const userIdFromStorage = localStorage.getItem("userId"); //Here we check whether the userId is logged in?
        if(userIdFromStorage && !currUser){
            setCurrUser(userIdFromStorage);
        }
        if(!userIdFromStorage && !["/signup" , "/auth"].includes(window.location.pathname)){ //Checks weather
            navigate("/auth");
        }
        if(userIdFromStorage && ["/signup" , "/auth"].includes(window.location.pathname)){
            navigate("/");
        }

    } , [currUser , setCurrUser , navigate]);

    let element = useRoutes([
        {
            path:"/",
            element:<Dashboard/>
        },
        {
            path:"/auth" , 
            element:<Login/>
        },
        {
            path:'/signup',
            element:<Signup/>
        },
        {
            path:"/profile",
            element:<Profile/>
        },
        {
            path:"/repo/:repoId",
            element:<RepoPage/>
        }

    ]);

    return element;
}
export default ProjectRoutes;
