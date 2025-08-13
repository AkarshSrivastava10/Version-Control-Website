import React, { useDeferredValue, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./profile.css";
import Navbar from "../Navbar";
import { UnderlineNav } from "@primer/react";
import { BookIcon, RepoIcon } from "@primer/octicons-react";
import { useAuth } from "../authContext";
import HeatMapProfile from "./Heatmap";

const Profile = () => {
    const backendPort=import.meta.env.VITE_BACKEND_PORT;
    const navigate = useNavigate();
    const { setCurrUser } = useAuth();
    const [userDetails , setUserDetails] = useState({
        username: "loading...", // Default state
    });
    const [repositories, setRepositories] = useState([]);
    
    useEffect(() => {
        const fetchUserDetails = async () => {
            const userId = localStorage.getItem('userId');
            
            if (!userId) {
                console.warn("User ID not found, redirecting to login.");
                navigate("/auth");
                return;
            }

            try {
                // Now using the actual API call
                const result = await axios.get(`http://localhost:${backendPort}/user/${userId}`);
                setUserDetails(result.data);
                setRepositories(result.data.repositories);
            }
            catch (err) {
                console.error("Error while fetching user details: ", err);
                // Optionally handle specific errors, e.g., redirect to login if token is invalid
            }
        }
        fetchUserDetails();
    }, [navigate]); // Added navigate to the dependency array

    function logout() {
        localStorage.removeItem("userId");
        localStorage.removeItem("token");
        setCurrUser(null);
        navigate("/auth");
    }

    return (
        <>
            <Navbar />
            <div className="profile-page-container">
                {/* Left Sidebar */}
                <aside className="profile-sidebar">
                    <img src="https://static.vecteezy.com/system/resources/previews/005/544/718/non_2x/profile-icon-design-free-vector.jpg" alt="Profile" className="profile-image" />
                    <div className="name-section">
                        <h2 className="username">{userDetails.username}</h2>
                        {userDetails.bio && <p className="user-bio">{userDetails.bio}</p>}
                    </div>

                    <button className="follow-btn">Follow</button>
                    <button className="logout-btn" onClick={logout}>Logout</button>

                    <div className="follower-stats">
                        <p><b>{userDetails.followers || 0}</b> followers</p>
                        <p><b>{userDetails.following || 0}</b> following</p>
                    </div>
                </aside>

                {/* Main Content Area */}
                <main className="profile-main-content">
                    <UnderlineNav aria-label="Profile navigation">
                        <UnderlineNav.Item
                            aria-current="page"
                            icon={BookIcon}
                            sx={{
                                backgroundColor: "transparent",
                                color: "white",
                                "&:hover": {
                                    textDecoration: "underline",
                                    color: "white",
                                },
                            }}
                        >
                            Overview
                        </UnderlineNav.Item>
                    
                    </UnderlineNav>

                    {/* Contribution Heatmap */}
                    <div className="heatmap-section">
                        <h3 className="section-title">Contributions</h3>
                        {/* The HeatMapProfile component would go here */}
                        <div className="heatmap-placeholder">
                            <HeatMapProfile />
                        </div>
                    </div>

                    {/* Repository List */}
                    <div className="repo-list-section">
                        <h3 className="section-title">Repositories</h3>
                        <div className="repo-cards-container">
                            {repositories.length > 0 ? (
                                repositories.map((repo) => (
                                    <div key={repo._id} className="repo-card">
                                        <h4 className="repo-name">
                                            <Link to={`/repo/${repo._id}`}>{repo.name}</Link>
                                        </h4>
                                        {repo.description && <p className="repo-description">{repo.description}</p>}
                                    </div>
                                ))
                            ) : (
                                <p className="no-repos-message">No repositories found.</p>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
};

export default Profile;
