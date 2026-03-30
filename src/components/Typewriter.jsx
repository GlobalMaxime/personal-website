import React, { useState, useEffect, useRef } from 'react';

// Renders its children progressively line by line.
// Expects an array of elements or raw text lines.
const Typewriter = ({ lines, delay = 20, onComplete = () => {} }) => {
  const [displayedIndex, setDisplayedIndex] = useState(0);
  const endRef = useRef(null);

  useEffect(() => {
    if (displayedIndex < lines.length) {
      const timer = setTimeout(() => {
        setDisplayedIndex(prev => prev + 1);
        endRef.current?.scrollIntoView({ behavior: 'auto' });
      }, delay);
      return () => clearTimeout(timer);
    } else {
      onComplete();
    }
  }, [displayedIndex, lines.length, delay, onComplete]);

  return (
    <div className="typewriter-output">
      {lines.slice(0, displayedIndex).map((line, i) => (
        <div key={i} style={{ minHeight: '1.2em' }}>
          {line}
        </div>
      ))}
      {/* Invisible anchor strictly for scrolling to bottom of current typing block */}
      <div ref={endRef} />
    </div>
  );
};

export default Typewriter;
