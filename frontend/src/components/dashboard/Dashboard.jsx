import axios from "axios";
import React , {useState , useEffect} from "react";
import { Link } from "react-router-dom"; // Import Link for navigation
import "./dashboard.css";
import Navbar from "../Navbar"; // Assuming Navbar is in the parent directory

function Dashboard(){

    const [repositories , setRepositories] = useState([]); //This is to retrive repo of the curr user
    const [searchQuery , setSearchQuery] = useState("");
    const [suggestedRepo , setSuggestedRepo] = useState([]); //This is to retrive repo of the all user
    const [searchResults , setSearchResults] = useState([]); 
    
    // Hardcoded events as per your initial request
    const [upcomingEvents, setUpcomingEvents] = useState([
        "Technology conference - September 15",
        "React summit - September - 21",
        "Developers meetup - Octobe - 10r"
    ]);

    useEffect(()=>{
        const backendPort=import.meta.env.VITE_BACKEND_PORT;
        const userIdFromStorage = localStorage.getItem("userId");
        const token = localStorage.getItem("token"); // Assuming token is stored for auth

        const fetchRepositories=async()=>{          //For current user
            try{
                // This will now hit your backend server
                const response = await axios.get(`http://localhost:${backendPort}/repo/user/${userIdFromStorage}`, {
                  headers: { Authorization: `Bearer ${token}` } // Add auth header if backend is protected
                });
                setRepositories(response.data);
                setSearchResults(response.data); // Initialize search results here
            }
            catch(err){
                console.error("Error while fetching the repositories : " , err);
            }
        }
        const fetchSuggestedRepositories=async()=>{     //All repositories
            try{
                // This will now hit your backend server
                const response = await axios.get(`http://localhost:${backendPort}/repo/all`, {
                  headers: { Authorization: `Bearer ${token}` } // Add auth header if backend is protected
                });
                setSuggestedRepo(response.data);
            }
            catch(err){
                console.error("Error while fetching the repositories : " , err);
            }
        }

        // Only fetch if userId and token exist (simulating authenticated user)
        if (userIdFromStorage && token) {
            fetchRepositories();
            fetchSuggestedRepositories();
        } else {
            console.warn("User ID or token not found in localStorage. Please ensure user is logged in.");
            // You might want to redirect to a login page here in a real application
            // Example: navigate('/login');
        }
    } , []);

    useEffect(()=>{  //For search bar (applies to Your Repositories)
        if(searchQuery === ""){
            setSearchResults(repositories);
        }
        else{
            const filteredRepo = repositories.filter((repo)=>
                repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (repo.description && repo.description.toLowerCase().includes(searchQuery.toLowerCase()))
            );
            setSearchResults(filteredRepo);
        }
    } , [searchQuery , repositories]); // Depend on 'repositories' for search filtering

    return(
        <> 
            <Navbar/>
            <section id="dashboard" className="dashboard-container-v2"> {/* Main container for dashboard */}
                {/* Left Panel: Suggested Repositories */}
                <aside className="dashboard-aside-v2">
                    <h3 className="card-title-v2">Suggested Repositories</h3>
                    <ul className="repo-list-v2">
                        {suggestedRepo.length > 0 ? (
                            suggestedRepo.map((repo)=>{
                                return (
                                    <li key={repo._id || repo.name} className="repo-item-v2">
                                        <Link to={`/repo/${repo._id}`} className="repo-link-v2">
                                            <h4 className="repo-name-v2">{repo.name}</h4>
                                            {repo.description && <p className="repo-description-v2">{repo.description}</p>}
                                        </Link>
                                    </li>
                                );
                            })
                        ) : (
                            <p className="no-results-v2">No suggested repositories available.</p>
                        )}
                    </ul>
                </aside>

                {/* Middle Panel: Your Repositories */}
                <main className="dashboard-main-v2">
                    <h2 className="card-title-v2">Your Repositories</h2>
                    <div id="searchYourRepo" className="search-box-v2">
                        <input 
                            type="text" 
                            placeholder="Search your repositories..." 
                            value={searchQuery} 
                            onChange={(event)=>setSearchQuery(event.target.value)}
                            className="search-input-v2"
                        />
                    </div>
                    <ul className="repo-list-v2">
                        {searchResults.length > 0 ? (
                            searchResults.map((repo)=>{
                                return (
                                    <li key={repo._id || repo.name} className="repo-item-v2">
                                        <Link to={`/repo/${repo._id}`} className="repo-link-v2">
                                            <h4 className="repo-name-v2">{repo.name}</h4>
                                            {repo.description && <p className="repo-description-v2">{repo.description}</p>}
                                        </Link>
                                    </li>
                                );
                            })
                        ) : (
                            <p className="no-results-v2">No repositories found matching your search.</p>
                        )}
                    </ul>
                </main>

                {/* Right Panel: Upcoming Events */}
                <aside className="dashboard-aside-v2">
                    <h3 className="card-title-v2">Upcoming Events</h3>
                    <ul className="event-list-v2">
                        {upcomingEvents.map((event, index)=>{
                            return (
                                <li key={index} className="event-item-v2">
                                    <p>{event}</p>
                                </li>
                            );
                        })}
                    </ul>
                </aside>
            </section>
        </>
    )
}

export default Dashboard;
