// ************************************************************************ 
// FRONTEND VISUALIZATION COMPONENT - WELCOME PAGE
// ************************************************************************
// This component serves as the entry welcome page for the Kloudbugs Mining Platform.
// ************************************************************************

import React from 'react';
import { Link } from 'wouter';
import '../cosmic-theme.css';

const WelcomePage: React.FC = () => {
  return (
    <div className="welcome-page">
      <div className="stars"></div>
      <div className="welcome-container">
        <h1 className="welcome-title">
          <span className="cosmic-gradient">KLOUDBUGS CAFE</span>
        </h1>
        <div className="welcome-subtitle">Advanced Cosmic Mining Platform</div>
        
        <div className="welcome-description">
          Welcome to the Kloudbugs Cosmic Mining Platform, an advanced AI-powered 
          mining operations platform providing dynamic computational resource 
          management with an immersive, interactive user experience.
        </div>
        
        <div className="welcome-mission">
          <p>In Honor of</p>
          <h2 className="cosmic-gradient">Tera Ann Harris</h2>
          <p className="quote">Mother of seven whose voice was silenced.</p>
          <p>Her courage guides our mission.</p>
        </div>
        
        <div className="welcome-buttons">
          <Link href="/home">
            <button className="welcome-button">Learn More</button>
          </Link>
          <Link href="/visualization">
            <button className="welcome-button primary">Enter Visualization</button>
          </Link>
        </div>
        
        <div className="frontend-badge">
          Frontend Visualization Preview
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;