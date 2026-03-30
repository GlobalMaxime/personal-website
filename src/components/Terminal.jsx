import React, { useState, useEffect, useRef } from 'react';
import { handleCommand } from '../utils/commandHandler';
import TetrisGame from './commands/TetrisGame';
import StarWarsOutput from './commands/StarWarsOutput';

const Prompt = () => (
  <div className="prompt">
    <span className="prompt-user">visitor</span>
    <span className="prompt-at">@</span>
    <span className="prompt-host">milan-env</span>
    <span className="prompt-symbol">:</span>
    <span className="prompt-dir">~</span>
    <span className="prompt-symbol">$</span>
  </div>
);

const Terminal = () => {
  const [history, setHistory] = useState([
    {
      command: '', // Initial load
      output: handleCommand('help', () => {}, () => {}) // Trigger a custom help render on mount
    }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [activeApp, setActiveApp] = useState(null); // { name: string, options: object }
  
  const endOfContainerRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    endOfContainerRef.current?.scrollIntoView({ behavior: 'auto' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [history, activeApp]);

  const clearTerminal = () => {
    setHistory([]);
  };

  const startApp = (appName, options = {}) => {
    setActiveApp({ name: appName, options });
  };

  const exitApp = () => {
    if (!activeApp) return;
    const exitedApp = activeApp.name;
    setActiveApp(null);
    setHistory(prev => [...prev, { command: '', output: <div className="color-red">{exitedApp} process exited normally.</div> }]);
    setTimeout(focusInput, 100);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (activeApp) return;

    const cmd = inputVal.trim();
    
    if (cmd) {
      setCommandHistory(prev => [...prev, cmd]);
      setHistoryIndex(-1);
    }

    if (cmd.toLowerCase() === 'clear') {
      clearTerminal();
      setInputVal('');
      return;
    }

    const outputElement = handleCommand(cmd, clearTerminal, startApp);
    setHistory(prev => [...prev, { command: cmd, output: outputElement }]);
    setInputVal('');
  };

  const handleKeyDown = (e) => {
    if (activeApp) return;

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0 && historyIndex < commandHistory.length - 1) {
        const nextIdx = historyIndex + 1;
        setHistoryIndex(nextIdx);
        setInputVal(commandHistory[commandHistory.length - 1 - nextIdx]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const nextIdx = historyIndex - 1;
        setHistoryIndex(nextIdx);
        setInputVal(commandHistory[commandHistory.length - 1 - nextIdx]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInputVal('');
      }
    }
  };

  const focusInput = () => {
    if (!activeApp) {
      inputRef.current?.focus();
    }
  };

  // FULLSCREEN TAKEOVER IF ACTIVE APP
  if (activeApp?.name === 'tetris') {
    return (
      <div className="terminal-container" style={{ padding: '0', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <TetrisGame onExit={exitApp} initialMode={activeApp.options?.mode || 'PLAYING'} />
      </div>
    );
  }

  if (activeApp?.name === 'starwars') {
    return (
      <div className="terminal-container" style={{ padding: '0', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <StarWarsOutput onExit={exitApp} />
      </div>
    );
  }

  // STANDARD TERMINAL
  return (
    <div className="terminal-container" onClick={focusInput}>
      {history.map((h, i) => (
        <div key={i} className="history-block">
          {h.command !== '' && (
            <div className="command-line">
              <Prompt />
              <span className="command-text">{h.command}</span>
            </div>
          )}
          <div className="cmd-output">
            {h.output}
          </div>
        </div>
      ))}

      <form className="input-line" onSubmit={onSubmit}>
        <Prompt />
        <input 
          ref={inputRef}
          type="text" 
          className="terminal-input"
          value={inputVal}
          onChange={e => setInputVal(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
          spellCheck="false"
          autoComplete="off"
        />
      </form>
      <div ref={endOfContainerRef} />
    </div>
  );
};

export default Terminal;
