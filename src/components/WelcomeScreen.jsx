import React from 'react';

const WelcomeScreen = ({ onEnter }) => {
  return (
    <div style={{
      height: '100%',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'var(--term-bg)'
    }}>
      <div style={{
        color: 'var(--term-prompt-host)',
        fontFamily: 'monospace',
        fontSize: '32px',
        letterSpacing: '4px',
        fontWeight: 'bold',
        marginBottom: '10px'
      }}>
        SYSTEM_ENV
      </div>
      
      <p style={{ marginTop: '0', color: 'var(--term-fg)', opacity: 0.8, fontSize: '18px', fontFamily: 'var(--font-mono)' }}>
        Milan's Environment
      </p>

      <button 
        onClick={onEnter}
        className="welcome-btn"
      >
        [ ENTER ]
      </button>

      <style>{`
        .welcome-btn {
          margin-top: 40px;
          background: transparent;
          border: 2px solid var(--term-prompt-host);
          color: var(--term-prompt-host);
          padding: 12px 24px;
          font-family: var(--font-mono);
          font-size: 1.2rem;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .welcome-btn:hover {
          background: var(--term-prompt-host);
          color: var(--term-bg);
          box-shadow: 0 0 15px rgba(114, 159, 207, 0.4);
        }
      `}</style>
    </div>
  );
};

export default WelcomeScreen;
