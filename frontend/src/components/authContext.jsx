import { useState , useContext , useEffect , createContext, Children } from "react";

const AuthContext=createContext(); //For when in frontend aat any route,we are creating a context that will check whether the user is logged in

export const useAuth = ()=>{  //this is a custom hook
    return useContext(AuthContext);
}

export const AuthProvider = ({children})=>{
    let [currUser , setCurrUser]=useState(null);
    useEffect(()=>{ //It will check for every rendering that user is logged or not
        const userId=localStorage.getItem('userId');
        if(userId){
            setCurrUser((currUserId)=>{
                return userId;
            });
        }
    } , []);

    const value={
        currUser , setCurrUser
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider> 
}