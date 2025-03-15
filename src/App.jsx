import React, { useState, useEffect } from 'react';
import Scene from './components/three/Scene';
import Introduction from './components/ui/Introduction';
import './styles/UI.css';

function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [isInitialScreen, setIsInitialScreen] = useState(true);

  // Listen for toggle introduction events from Scene component
  useEffect(() => {
    const handleToggleIntro = (event) => {
      setShowIntro(event.detail.show);
      setIsInitialScreen(false);
    };
    window.addEventListener('toggleIntroduction', handleToggleIntro);
    return () => window.removeEventListener('toggleIntroduction', handleToggleIntro);
  }, []);

  const handleClose = () => {
    setShowIntro(false);
    // Dispatch event to notify Scene component
    const event = new CustomEvent('introductionClosed');
    window.dispatchEvent(event);
  };

  return (
    <div className="app">
      <Scene />
      {showIntro && (
        <Introduction 
          onClose={handleClose}
          isInitialScreen={isInitialScreen}
        />
      )}
    </div>
  );
}

export default App; 