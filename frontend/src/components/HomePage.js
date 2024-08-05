import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css'; // Import the CSS for styling

const HomePage = () => {
    return (
        <div className="home-page">
            <header className="hero-section">
                <h1>Welcome to the Home Page</h1>
                <Link to="/login">
                    <button className="login-button">Login</button>
                </Link>
            </header>
        </div>
    );
};

export default HomePage;
