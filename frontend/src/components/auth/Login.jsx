import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../authContext";

import { PageHeader } from "@primer/react";
import { Box, Button } from "@primer/react";
import "./auth.css";

import logo from "../../assets/githubAlt.svg";
import { Link , useNavigate} from "react-router-dom";

const Login = () => {

    const navigate = useNavigate();

    // useEffect(()=>{
    //     localStorage.removeItem('userId'); //Remove userId from local storage 
    //     localStorage.removeItem('token'); //Remove userId from local storage 
    //     setCurrUser(null); //From useAuth
    // });
    const backendPort=import.meta.env.VITE_BACKEND_PORT;
    const [email , setEmail]=useState("");
    const [password , setPassword]=useState("")
    const [loading,setLoading] = useState(false);
    const { setCurrUser} = useAuth();

    const handleLogin = async (event)=>{
        event.preventDefault();
        try{
            setLoading(true);
            const result = await axios.post(`http://localhost:${backendPort}/login/` , {email:email , password:password});

            const userId = result.data.userId;
            const token = result.data.token;

            // console.log(result);

            localStorage.setItem('userId' , userId);
            localStorage.setItem('token' , token);

            setCurrUser(localStorage.userId);
            setLoading(false);

            navigate("/"); //Naavigation to the dashboard
        }
        catch(err){
            console.error("Error while login : " , err);
            alert("Login failed!");
            setLoading(false);
        }
    }

    return (
        <div className="login-wrapper">
        <div className="login-logo-container">
            <img className="logo-login" src={logo} alt="Logo" />
        </div>

        <div className="login-box-wrapper">
            <div className="login-heading">
            <Box sx={{ padding: 1 }}>
                <PageHeader>
                <PageHeader.TitleArea variant="large">
                    <PageHeader.Title>Login</PageHeader.Title>
                </PageHeader.TitleArea>
                </PageHeader>
            </Box>
            </div>
            <div className="login-box">
            <div>
                <label className="label">Email address</label>
                <input
                autoComplete="off"
                name="Email"
                id="Email"
                className="input"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                />
            </div>
            <div className="div">
                <label className="label">Password</label>
                <input
                autoComplete="off"
                name="Password"
                id="Password"
                className="input"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                />
            </div>

            <Button
                variant="primary"
                className="login-btn"
                onClick={handleLogin}
                disabled={loading}
            >
                {loading?'loading...':'Login'}
            </Button>
            </div>
            <div className="pass-box">
            <p>
                New to GitHub? <Link to="/signup">Create an account</Link>
            </p>
            </div>
        </div>
        </div>
    );
    };

export default Login;