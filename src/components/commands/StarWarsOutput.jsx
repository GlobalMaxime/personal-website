import React, { useState, useEffect, useRef, useCallback } from 'react';

const URL = 'https://raw.githubusercontent.com/jimmckeeth/blinkenlights/main/starwars.txt';
// Playback speed multiplier (15 FPS original, so 1000/15 approx 67ms per frame unit)
const FRAME_TIME_MS = 67; 
const LINES_PER_FRAME = 14; 

const StarWarsOutput = ({ onExit }) => {
  const [frames, setFrames] = useState([]);
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const timeoutRef = useRef(null);

  // Global exit listener
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape' || e.key.toLowerCase() === 'q') {
      e.preventDefault();
      onExit();
    }
  }, [onExit]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown, { capture: true });
    return () => document.removeEventListener('keydown', handleKeyDown, { capture: true });
  }, [handleKeyDown]);

  useEffect(() => {
    let active = true;

    fetch(URL)
      .then(res => {
        if (!res.ok) throw new Error('Data transmission intercepted by Empire.');
        return res.text();
      })
      .then(text => {
        if (!active) return;
        
        const lines = text.split('\n');
        const parsedFrames = [];
        
        for (let i = 0; i < lines.length; i += LINES_PER_FRAME) {
          if (i + LINES_PER_FRAME > lines.length) break;
          // First line is delay in frame units
          const delayStr = lines[i].trim();
          const delay = parseInt(delayStr, 10);
          
          if (isNaN(delay)) continue; 

          // Next 13 lines are the frame body
          const body = lines.slice(i + 1, i + LINES_PER_FRAME).join('\n');
          parsedFrames.push({ delay, body });
        }

        // Remove branding by slicing off the first 3 frames (which render the website URL)
        // We start right at "20th Century Fox"
        if (parsedFrames.length > 5) {
          setFrames(parsedFrames.slice(3));
        } else {
          setFrames(parsedFrames);
        }
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });

    return () => { active = false; };
  }, []);

  // Animation Loop Hook
  useEffect(() => {
    if (frames.length === 0 || loading || error) return;
    
    if (currentFrameIndex >= frames.length) {
      onExit();
      return;
    }

    const currentFrame = frames[currentFrameIndex];
    const msToWait = (currentFrame.delay || 1) * FRAME_TIME_MS;

    timeoutRef.current = setTimeout(() => {
      setCurrentFrameIndex(prev => prev + 1);
    }, msToWait);

    return () => clearTimeout(timeoutRef.current);
  }, [currentFrameIndex, frames, loading, error, onExit]);

  if (loading) return <div className="color-cyan" style={{ padding: '20px' }}>Establishing datalink to HoloNet Proxy [github]...</div>;
  if (error) return <div className="color-red" style={{ padding: '20px' }}>Transmission failed: {error}</div>;

  const currentBody = frames[currentFrameIndex]?.body || '';

  return (
    <div style={{
      fontFamily: 'var(--font-mono)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      height: '100%',
      backgroundColor: 'var(--term-bg)',
      color: 'var(--term-yellow)', // Classic Starwars yellow
      fontSize: '20px',
      whiteSpace: 'pre-wrap',
      lineHeight: '1.2'
    }}>
      <div style={{ position: 'absolute', top: '20px', left: '20px', color: 'var(--term-fg)', opacity: 0.5, fontSize: '14px' }}>
        [ESC/Q]: Terminate playback
      </div>
      <pre style={{ margin: '0 auto', minWidth: '70ch', textAlign: 'left' }}>{currentBody}</pre>
    </div>
  );
};

export default StarWarsOutput;
