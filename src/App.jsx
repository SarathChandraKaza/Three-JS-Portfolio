import React, { useState, useEffect } from 'react';
import Scene from './components/three/Scene';
import LoadingScreen from './components/ui/LoadingScreen';
import Introduction from './components/ui/Introduction';
import './styles/UI.css';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="app">
      <Scene />
      <LoadingScreen isLoading={isLoading} />
      {!isLoading && showIntro && (
        <Introduction onClose={() => setShowIntro(false)} />
      )}
    </div>
  );
}

export default App; 