import React, { useState, useEffect } from 'react';
import Scene from './components/three/Scene';
import LoadingScreen from './components/ui/LoadingScreen';
import Introduction from './components/ui/Introduction';
import './styles/UI.css';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [showIntro, setShowIntro] = useState(true);
  const [isInitialScreen, setIsInitialScreen] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

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
      <LoadingScreen isLoading={isLoading} />
      {!isLoading && showIntro && (
        <Introduction 
          onClose={handleClose}
          isInitialScreen={isInitialScreen}
        />
      )}
    </div>
  );
}

export default App; 