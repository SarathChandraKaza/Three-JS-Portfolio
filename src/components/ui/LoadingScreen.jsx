import React from 'react';
import '../../styles/LoadingScreen.css';

const LoadingScreen = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <div id="loading-screen">
      <div className="loader"></div>
      <p>Hold tight! The planets are aligning.</p>
    </div>
  );
};

export default LoadingScreen; 