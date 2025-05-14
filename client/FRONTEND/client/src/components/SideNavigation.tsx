import React, { useState } from 'react';
import './SideNavigation.css';
import { ElectricIcon } from './icons/CosmicIcons';

interface SideNavigationProps {
  onVoice: () => void;
  onToggleStats: () => void;
  onToggleElectricEffects?: () => void;
}

const SideNavigation: React.FC<SideNavigationProps> = ({ 
  onVoice,
  onToggleStats,
  onToggleElectricEffects = () => {}
}) => {
  const [electricActive, setElectricActive] = useState(false);
  
  // Handle electric effects toggle
  const handleElectricToggle = () => {
    setElectricActive(!electricActive);
    onToggleElectricEffects();
  };

  return (
    <div className="sidebar-nav">
      {/* Logo or Title */}
      <div className="sidebar-title">
        KLOUDBUGS CAFE
      </div>
      
      <div className="nav-divider"></div>
      
      {/* Animation Controls Header */}
      <div className="sidebar-section-label">Animation Controls</div>
      
      {/* Electric Effects Toggle button (Lightning Bolt) */}
      <button 
        className={`nav-button ${electricActive ? 'nav-button-electric' : ''}`}
        onClick={handleElectricToggle}
      >
        <ElectricIcon className="cosmic-icon" />
      </button>
      <div className="tooltip">{electricActive ? 'Disable Electric Effects' : 'Enable Electric Effects'}</div>
    </div>
  );
};

export default SideNavigation;