// ************************************************************************ 
// FRONTEND VISUALIZATION COMPONENT - VISUALIZATION PAGE
// ************************************************************************
// This component wraps the main visualization interface for the Kloudbugs Mining Platform.
// ************************************************************************

import React from 'react';
import { Link } from 'wouter';
import App from '../App';

const VisualizationPage: React.FC = () => {
  return (
    <div className="visualization-page" style={{ height: '100vh', width: '100vw', position: 'relative' }}>
      {/* Return to Home link */}
      <div style={{ 
        position: 'absolute', 
        top: '20px', 
        left: '20px', 
        zIndex: 1000,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        borderRadius: '4px',
        padding: '6px 12px',
        border: '1px solid #8A2BE2',
      }}>
        <Link href="/">
          <button style={{ 
            color: '#8A2BE2', 
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            fontSize: '14px',
            fontFamily: 'monospace',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0
          }}>
            ← Back to Home
          </button>
        </Link>
      </div>
      
      {/* The main visualization interface */}
      <App />
    </div>
  );
};

export default VisualizationPage;