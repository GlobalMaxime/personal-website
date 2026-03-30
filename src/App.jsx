import React, { useState } from 'react';
import Terminal from './components/Terminal';
import WelcomeScreen from './components/WelcomeScreen';
import './index.css';

function App() {
  const [hasEntered, setHasEntered] = useState(false);

  return (
    <div className="App" style={{ height: '100vh', width: '100vw' }}>
      {!hasEntered ? (
        <WelcomeScreen onEnter={() => setHasEntered(true)} />
      ) : (
        <Terminal />
      )}
    </div>
  );
}

export default App;
