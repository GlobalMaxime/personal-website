import React, { useState, useEffect, useRef } from 'react';

const DonutOutput = () => {
  const [frame, setFrame] = useState('');
  const A = useRef(1);
  const B = useRef(1);

  useEffect(() => {
    let animationFrameId;

    const renderFrame = () => {
      let b = [];
      let z = [];
      A.current += 0.04;
      B.current += 0.02;
      let cA = Math.cos(A.current), sA = Math.sin(A.current),
          cB = Math.cos(B.current), sB = Math.sin(B.current);
          
      for (let k = 0; k < 1760; k++) {
        b[k] = k % 80 === 79 ? '\n' : ' ';
        z[k] = 0;
      }
      
      for (let j = 0; j < 6.28; j += 0.07) { 
        let ct = Math.cos(j), st = Math.sin(j);
        for (let i = 0; i < 6.28; i += 0.02) { 
          let sp = Math.sin(i), cp = Math.cos(i),
              h = ct + 2, 
              D = 1 / (sp * h * sA + st * cA + 5), 
              t = sp * h * cA - st * sA; 

          let x = 0 | (40 + 30 * D * (cp * h * cB - t * sB)),
              y = 0 | (12 + 15 * D * (cp * h * sB + t * cB)),
              o = x + 80 * y,
              N = 0 | (8 * ((st * sA - sp * ct * cA) * cB - sp * ct * sA - st * cA - cp * ct * sB));
              
          if (y < 22 && y >= 0 && x >= 0 && x < 79 && D > z[o]) {
            z[o] = D;
            b[o] = ".,-~:;=!*#$@"[N > 0 ? N : 0];
          }
        }
      }
      setFrame(b.join(""));
      animationFrameId = requestAnimationFrame(renderFrame);
    };

    renderFrame();

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <div style={{ padding: '20px 0', display: 'flex', justifyContent: 'center' }}>
      <pre style={{ 
        margin: 0, 
        fontFamily: 'var(--font-mono)', 
        color: 'var(--term-cyan)',
        lineHeight: '14px',
        fontSize: '14px',
        fontWeight: 'bold',
        textShadow: '0 0 5px rgba(0, 255, 255, 0.4)'
      }}>
        {frame}
      </pre>
    </div>
  );
};

export default DonutOutput;
