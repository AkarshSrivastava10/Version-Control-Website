import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate , Link } from "react-router-dom";

import { PageHeader } from "@primer/react";
import { Button , Box } from "@primer/react";

import "./auth.css";
import { useAuth } from "../authContext";

import logo from "../../assets/githubAlt.svg";

const Signup = () => {
  const navigate=useNavigate();
  const {setCurrUser}=useAuth();

  //States
  const backendPort=import.meta.env.VITE_BACKEND_PORT;
  const [email , setEmail] = useState("");
  const [username , setUsername] = useState("");
  const [password , setPassword] = useState("");
  const [loading , setLoading] = useState(false);

  const handleSignup = async (event)=>{
    event.preventDefault();
    try{
      setLoading(true);
      const result = await axios.post(`http://localhost:${backendPort}/signup/` , {email:email , password:password , username:username});

      localStorage.setItem("token" , result.data.token);
      localStorage.setItem("userId" , result.data.userId); 

      setCurrUser(localStorage.userId); //This is provied through the contect from authContext() API
      setLoading(false);
      navigate("/");

    }
    catch(err){
      console.error("Error while signing up : " , err);
      alert('Signup failed!');
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
                <PageHeader.Title>Sign Up</PageHeader.Title>
              </PageHeader.TitleArea>
            </PageHeader>
          </Box>
        </div>

        <div className="login-box">
          <div>
            <label className="label">Username</label>
            <input
              autoComplete="off"
              name="Username"
              id="Username"
              className="input"
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
            />
          </div>

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

          <Button variant="primary" className="login-btn" onClick={handleSignup} disabled={loading}>
            {loading? "loading..." : "Signup"}
          </Button>
        </div>

        <div className="pass-box">
          <p>
            Already have an account? <Link to="/auth">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;