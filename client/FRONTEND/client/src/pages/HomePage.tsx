// ************************************************************************ 
// FRONTEND VISUALIZATION COMPONENT - HOME PAGE
// ************************************************************************
// This component serves as the home page with detailed information about
// the Kloudbugs Mining Platform.
// ************************************************************************

import React from 'react';
import { Link } from 'wouter';
import '../cosmic-theme.css';

const HomePage: React.FC = () => {
  return (
    <div className="home-page">
      <div className="stars"></div>
      <div className="home-container">
        <header className="home-header">
          <h1 className="cosmic-gradient">KLOUDBUGS CAFE</h1>
          <div className="header-subtitle">Mining Platform</div>
        </header>
        
        <section className="section">
          <h2>Platform Vision</h2>
          <p>
            Our one-of-a-kind mining platform increases your profits while serving a
            higher purpose. Kloud miners will generate financial wealth and support
            social justice projects. Each hash we mine strengthens our fight for justice.
          </p>
        </section>
        
        <section className="section">
          <h2>Guardian AI System</h2>
          <div className="guardian-grid">
            <div className="guardian-card">
              <h3>Content Safety</h3>
              <p>Ensures ethical standards in all mining operations.</p>
            </div>
            <div className="guardian-card">
              <h3>Accuracy Validator</h3>
              <p>Maintains precision in computational resources.</p>
            </div>
            <div className="guardian-card">
              <h3>Bias Detector</h3>
              <p>Ensures fair distribution of mining resources.</p>
            </div>
            <div className="guardian-card">
              <h3>Privacy Guard</h3>
              <p>Protects sensitive information in mining operations.</p>
            </div>
          </div>
        </section>
        
        <section className="section">
          <h2>Our Mission</h2>
          <p>
            The Kloud Bugs Mining Collective is a beacon for those not forgotten and
            truly loved. We transform digital power into social change. Through this
            portal, we seek truth and demand accountability.
          </p>
          <p>
            We honor Tera's legacy by building a new system where no mother's cry
            goes unheard. Join our cafe, the digital realm where we hear the voice,
            find the change, and heal the roots.
          </p>
        </section>
        
        <div className="home-buttons">
          <Link href="/">
            <button className="home-button">Back</button>
          </Link>
          <Link href="/visualization">
            <button className="home-button primary">Enter Visualization</button>
          </Link>
        </div>
        
        <div className="frontend-badge">
          Frontend Visualization Preview
        </div>
      </div>
    </div>
  );
};

export default HomePage;