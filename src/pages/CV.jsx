import React, { useState } from 'react';
import AboutMe from '../components/AboutMe';
import AboutYou from '../components/AboutYou';

const CV = () => {
  const [activeSide, setActiveSide] = useState(null); // 'me' | 'you' | null

  return (
    <div className="cv-container">
      {/* LEFT SIDE: A little bit about me */}
      <div className={`cv-half ${activeSide === 'me' ? 'active' : ''} ${activeSide === 'you' ? 'inactive' : ''}`}>
        <button 
          className="split-btn" 
          onClick={() => setActiveSide('me')}
        >
          A little bit about me &rsaquo;
        </button>
        <div className="half-content glass-panel" style={{ margin: '2rem', height: 'calc(100% - 4rem)' }}>
           {activeSide === 'me' && <AboutMe onClose={() => setActiveSide(null)} />}
        </div>
      </div>

      {/* RIGHT SIDE: A little bit about you */}
      <div className={`cv-half ${activeSide === 'you' ? 'active' : ''} ${activeSide === 'me' ? 'inactive' : ''}`}>
        <button 
          className="split-btn" 
          onClick={() => setActiveSide('you')}
        >
          &lsaquo; A little bit about you
        </button>
        <div className="half-content glass-panel" style={{ margin: '2rem', height: 'calc(100% - 4rem)' }}>
           {activeSide === 'you' && <AboutYou onClose={() => setActiveSide(null)} />}
        </div>
      </div>
    </div>
  );
};

export default CV;
