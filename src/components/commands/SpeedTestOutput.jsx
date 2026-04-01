import React, { useState, useEffect, useRef } from 'react';
import Typewriter from '../Typewriter';

const SpeedTestOutput = () => {
  const [phase, setPhase] = useState('init'); // init, ping, down, up, complete, error
  const [results, setResults] = useState({ ping: null, down: null, up: null });
  const [progress, setProgress] = useState(0);
  const [currentSpeedMbps, setCurrentSpeedMbps] = useState(0);

  const formatMbps = (bps) => (bps / 1000000).toFixed(2);

  useEffect(() => {
    let active = true;

    const runTests = async () => {
      try {
        // --- 1. PING ---
        if (!active) return;
        setPhase('ping');
        let pings = [];
        for (let i = 0; i < 5; i++) {
          const start = performance.now();
          AW_P: try {
            await fetch(`https://speed.cloudflare.com/__down?bytes=0&nocache=${start}`, { method: 'HEAD', mode: 'cors' });
            pings.push(performance.now() - start);
          } catch(e) {}
        }
        let avgPing = 0;
        if (pings.length > 0) {
          avgPing = pings.reduce((a, b) => a + b, 0) / pings.length;
        }
        setResults(prev => ({ ...prev, ping: Math.round(avgPing) }));

        // --- 2. DOWNLOAD ---
        if (!active) return;
        setPhase('down');
        setProgress(0);
        setCurrentSpeedMbps(0);
        
        const dlBps = await new Promise((resolve) => {
          const xhr = new XMLHttpRequest();
          const pSize = 15 * 1024 * 1024; // 15 MB
          const url = `https://speed.cloudflare.com/__down?bytes=${pSize}&nocache=${performance.now()}`;
          const start = performance.now();
          
          xhr.onprogress = (e) => {
            if (e.lengthComputable && active) {
              setProgress(Math.round((e.loaded / e.total) * 100));
              const elapsed = (performance.now() - start) / 1000;
              if (elapsed > 0.1) {
                const bps = (e.loaded * 8) / elapsed;
                setCurrentSpeedMbps(formatMbps(bps));
              }
            }
          };
          
          xhr.onload = () => {
            const elapsed = (performance.now() - start) / 1000;
            resolve((pSize * 8) / elapsed);
          };
          xhr.onerror = () => resolve(0);
          xhr.open('GET', url, true);
          xhr.send();
        });
        setResults(prev => ({ ...prev, down: formatMbps(dlBps) }));

        // --- 3. UPLOAD ---
        if (!active) return;
        setPhase('up');
        setProgress(0);
        setCurrentSpeedMbps(0);
        
        const ulBps = await new Promise((resolve) => {
          const xhr = new XMLHttpRequest();
          const pSize = 2 * 1024 * 1024; // 2 MB text chunk
          const payloadStr = '0'.repeat(pSize);
          const start = performance.now();
          
          xhr.upload.onprogress = (e) => {
            if (e.lengthComputable && active) {
              setProgress(Math.round((e.loaded / e.total) * 100));
              const elapsed = (performance.now() - start) / 1000;
              if (elapsed > 0.1) {
                const bps = (e.loaded * 8) / elapsed;
                setCurrentSpeedMbps(formatMbps(bps));
              }
            }
          };
          
          xhr.onload = () => {
            if (xhr.status === 200) {
              const elapsed = (performance.now() - start) / 1000;
              resolve((pSize * 8) / Math.max(elapsed, 0.1));
            } else {
              resolve(0); 
            }
          };
          
          xhr.onerror = async () => {
             // Fallback to fetch if XHR is strictly blocked (e.g. Brave shields)
             try {
                const fStart = performance.now();
                await fetch('https://speed.cloudflare.com/__up', {
                   method: 'POST',
                   body: payloadStr,
                   headers: { 'Content-Type': 'text/plain' },
                   mode: 'cors'
                });
                const fElapsed = (performance.now() - fStart) / 1000;
                resolve((pSize * 8) / Math.max(fElapsed, 0.1));
             } catch(err) {
                resolve(0);
             }
          };
          
          xhr.open('POST', 'https://speed.cloudflare.com/__up', true);
          xhr.setRequestHeader('Content-Type', 'text/plain');
          xhr.send(payloadStr);
        });
        setResults(prev => ({ ...prev, up: formatMbps(ulBps) }));

        if (active) setPhase('complete');

      } catch (err) {
        if (active) setPhase('error');
      }
    };

    runTests();
    return () => { active = false; };
  }, []);

  const renderProgressBar = () => {
    const filled = Math.round(progress / 5); // 20 blocks max
    const empty = 20 - filled;
    return `[${'#'.repeat(filled)}${' '.repeat(empty)}]`;
  };

  const getActiveDisplay = () => {
    if (phase === 'init') return <div className="dim blink">Securing telemetry links to Cloudflare edge nodes...</div>;
    if (phase === 'ping') return <div className="color-yellow blink">Attempting latency sync...</div>;
    if (phase === 'down') {
      return (
        <div>
          <div className="color-cyan" style={{ marginBottom: '8px' }}>Downloading 15MB arbitrary test block...</div>
          <div style={{ whiteSpace: 'pre' }}>
            {renderProgressBar()} {progress}%  |  <span className="color-green">{currentSpeedMbps} Mbps</span>
          </div>
        </div>
      );
    }
    if (phase === 'up') {
      return (
        <div>
          <div className="color-cyan" style={{ marginBottom: '8px' }}>Pushing 2MB randomized text string to remote host...</div>
          <div style={{ whiteSpace: 'pre' }}>
            {renderProgressBar()} {progress}%  |  <span className="color-green">{currentSpeedMbps} Mbps</span>
          </div>
        </div>
      );
    }
    if (phase === 'error') return <div className="color-red">Fatal error during data transfer limit execution.</div>;
    return null;
  };

  if (phase === 'complete') {
    const top = "╭─────────────┬────────────────────────────╮";
    const mid = "├─────────────┼────────────────────────────┤";
    const bot = "╰─────────────┴────────────────────────────╯";
    
    const lines = [
      <div key="s0" className="dim">Connection telemetry successful.</div>,
      <br key="sb1"/>,
      <div key="s_top" className="dim" style={{ whiteSpace: 'pre' }}>{top}</div>,
      <div key="s1" className="dim" style={{ whiteSpace: 'pre' }}>│ Metric      │ Measured Output            │</div>,
      <div key="s2" className="dim" style={{ whiteSpace: 'pre' }}>{mid}</div>,
      <div key="s3" style={{ whiteSpace: 'pre' }}>
        <span className="dim">│</span><span className="color-yellow"> Ping        </span><span className="dim">│</span><span className="color-green"> {(results.ping + ' ms').padEnd(26, ' ')} </span><span className="dim">│</span>
      </div>,
      <div key="s4" style={{ whiteSpace: 'pre' }}>
        <span className="dim">│</span><span className="color-yellow"> Download    </span><span className="dim">│</span><span className="color-green"> {(results.down + ' Mbps').padEnd(26, ' ')} </span><span className="dim">│</span>
      </div>,
      <div key="s5" style={{ whiteSpace: 'pre' }}>
        <span className="dim">│</span><span className="color-yellow"> Upload      </span><span className="dim">│</span><span className="color-green"> {(results.up + ' Mbps').padEnd(26, ' ')} </span><span className="dim">│</span>
      </div>,
      <div key="s6" className="dim" style={{ whiteSpace: 'pre' }}>{bot}</div>
    ];
    return (
      <div style={{ fontFamily: 'var(--font-mono)' }}>
        <Typewriter lines={lines} delay={20} />
      </div>
    );
  }

  return (
    <div style={{ fontFamily: 'var(--font-mono)', padding: '10px 0' }}>
      {results.ping !== null && <div className="color-green" style={{ marginBottom: '4px' }}>Latency locked: {results.ping} ms</div>}
      {results.down !== null && <div className="color-green" style={{ marginBottom: '8px' }}>Downlink established: {results.down} Mbps</div>}
      {getActiveDisplay()}
      <style>{`
        .blink { animation: blink 1s linear infinite; }
      `}</style>
    </div>
  );
};

export default SpeedTestOutput;
