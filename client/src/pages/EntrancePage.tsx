import React from 'react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import "@/styles/cosmic-theme.css";

const EntrancePage: React.FC = () => {
  return (
    <div className="welcome-page">
      <div className="stars"></div>
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        className="welcome-container"
      >
        <motion.h1 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="welcome-title"
        >
          <span className="cosmic-gradient">KLOUDBUGS CAFE</span>
        </motion.h1>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="welcome-subtitle"
        >
          Advanced Cosmic Mining Platform
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="welcome-description"
        >
          Welcome to the Kloudbugs Cosmic Mining Platform, an advanced AI-powered 
          mining operations platform providing dynamic computational resource 
          management with an immersive, interactive user experience.
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 0.8 }}
          className="welcome-mission"
        >
          <p>In Honor of</p>
          <h2 className="cosmic-gradient">Tera Ann Harris</h2>
          <p className="quote">Mother of seven whose voice was silenced.</p>
          <p>Her courage guides our mission.</p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 2.5, duration: 0.8 }}
          className="welcome-buttons"
        >
          <Link href="/visualization">
            <button className="cafe-entrance-button">
              Enter Cafe
            </button>
          </Link>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3, duration: 0.8 }}
          className="frontend-badge"
        >
          Cosmic Mining Platform
        </motion.div>
      </motion.div>
    </div>
  );
};

export default EntrancePage;