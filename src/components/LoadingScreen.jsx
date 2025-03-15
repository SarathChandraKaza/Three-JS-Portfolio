import React from 'react';
import './LoadingScreen.css';

const LoadingScreen = ({ progress }) => {
  const getLoadingText = () => {
    if (progress < 25) {
      return '"Cooper. It\'s not possible!"';
    } else if (progress < 50) {
      return '"No...It is necessary"';
    } else if (progress < 75) {
      return '"This is no time for caution"';
    } else {
      return '"Docking successfully accomplished."';
    }
  };

  return (
    <div id="loading-screen">
      <div className="loading-content">
        <p id="loading-progress">{Math.round(progress)}%</p>
        <p id="loading-text" style={{ fontStyle: 'italic' }}>
          {getLoadingText()}
        </p>
      </div>
    </div>
  );
};

export default LoadingScreen; 