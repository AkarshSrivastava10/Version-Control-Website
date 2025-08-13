import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/githubAlt.svg"; // Your original logo import
import "./navbar.css"; // Your original CSS import

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false); // State to manage mobile menu visibility

  return (
    <nav className="navbar"> {/* Added a class for consistent styling */}
      <Link to="/" className="logo-link"> {/* Added a class for consistent styling */}
        <div className="logo">
          <img src={logo} alt="myGit logo" />
          <h3>myGit</h3>
        </div>
      </Link>

      {/* Mobile Menu Button (Hamburger Icon) */}
      <button
        className="mobile-menu-button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle navigation"
      >
        {isOpen ? (
          // Close icon (X)
          <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        ) : (
          // Hamburger icon
          <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        )}
      </button>

      {/* Navigation Links */}
      {/* Conditionally apply 'open' class for mobile menu animation */}
      <div className={`links ${isOpen ? 'open' : ''}`}>
        <Link to="/repo/create" onClick={() => setIsOpen(false)}> {/* Close menu on link click */}
          <p>Create a repo</p>
        </Link>
        <Link to="/profile" onClick={() => setIsOpen(false)}> {/* Close menu on link click */}
          <p>Profile</p>
        </Link>
      </div>
    </nav>
  );
}
