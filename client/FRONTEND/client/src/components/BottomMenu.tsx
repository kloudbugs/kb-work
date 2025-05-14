// ************************************************************************ 
// FRONTEND VISUALIZATION COMPONENT - BOTTOM MENU
// ************************************************************************
// This component is part of the frontend visualization for the Kloudbugs Mining Platform.
// It provides the main entry point button for the mining visualization.
// ************************************************************************

import React from 'react';
import { EnterPlatformIcon } from './icons/CosmicIcons';
import './BottomMenu.css';

interface BottomMenuProps {
  onEnterCafe: () => void;
  onOpenVault?: () => void; // Made optional
}

const BottomMenu: React.FC<BottomMenuProps> = ({ onEnterCafe }) => {
  return (
    <div className="bottom-menu">
      <div style={{ 
        position: 'absolute', 
        bottom: '70px', 
        left: '50%', 
        transform: 'translateX(-50%)',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        color: '#8A2BE2',
        padding: '6px 12px',
        borderRadius: '4px',
        fontSize: '12px',
        fontFamily: 'monospace',
        border: '1px solid #8A2BE2',
        textAlign: 'center',
        boxShadow: '0 0 10px rgba(138, 43, 226, 0.5)',
        pointerEvents: 'none'
      }}>
        Frontend Visualization
      </div>
      <button 
        className="bottom-button enter-cafe-button"
        onClick={onEnterCafe}
      >
        <EnterPlatformIcon className="bottom-icon" />
        <span className="button-text">Enter Cafe</span>
      </button>
    </div>
  );
};

export default BottomMenu;