import React, { useState, useEffect, useCallback, useRef } from 'react';

// Standard Tetris constants
const COLS = 10;
const ROWS = 20;
const EMPTY = 0;
const CELL_SIZE = '30px'; 
const NEXT_CELL_SIZE = '24px'; 

// Tetromino definitions
const SHAPES = [
  [], // Empty 0
  [[1,1,1,1]], // I (Cyan)
  [[2,2], [2,2]], // O (Yellow)
  [[0,3,0], [3,3,3]], // T (Purple)
  [[0,4,4], [4,4,0]], // S (Green)
  [[5,5,0], [0,5,5]], // Z (Red)
  [[6,0,0], [6,6,6]], // J (Blue)
  [[0,0,7], [7,7,7]]  // L (Orange)
];

const COLORS = [
  'var(--term-bg)', // 0 Empty
  '#00ffff', // 1 Cyan
  '#ffff00', // 2 Yellow
  '#800080', // 3 Purple
  '#39ff14', // 4 Neon Green
  '#ff0000', // 5 Red
  '#0000ff', // 6 Blue
  '#ff7f00'  // 7 Orange
];

const BORDER_COLORS = [
  'transparent',
  'rgba(173, 255, 255, 0.8)',
  'rgba(255, 255, 173, 0.8)',
  'rgba(216, 173, 216, 0.8)',
  'rgba(173, 255, 185, 0.8)',
  'rgba(255, 173, 173, 0.8)',
  'rgba(173, 173, 255, 0.8)',
  'rgba(255, 212, 173, 0.8)'
];

const BOARD_INIT = Array.from({ length: ROWS }, () => Array(COLS).fill(EMPTY));

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_!?* ';
const PROFANITY_LIST = ['ASS','FAG','TIT','CUM','SEX','DIC','DIK','GAY','JEW','KKK','NIG','FUC','FUK','SHI','SHT','BIT','HOE','CUN','VAG','PEN','WTF'];

const TetrisGame = ({ onExit, initialMode = 'PLAYING' }) => {
  const [board, setBoard] = useState(BOARD_INIT);
  const [activePiece, setActivePiece] = useState(null);
  const [nextPiece, setNextPiece] = useState(null);
  const [gameState, setGameState] = useState(initialMode); // PLAYING, INITIALS, LEADERBOARD
  const [score, setScore] = useState(0);
  const [gameStartTime] = useState(Date.now());

  // Initials input state
  const [initials, setInitials] = useState([0, 0, 0]); // Indexes to ALPHABET array (default 'AAA')
  const [cursor, setCursor] = useState(0); 

  // Leaderboard data state
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [fetchStatus, setFetchStatus] = useState('LOADING'); // LOADING, SUCCESS, ERROR, EMPTY, FALLBACK

  // Custom Input Polling DAS
  const activeKeys = useRef({});
  const lockTimerRef = useRef(null);
  const activePieceRef = useRef(activePiece);
  const lowestGhostYRef = useRef(0);
  const currentGhostYRef = useRef(0);
  
  useEffect(() => {
    activePieceRef.current = activePiece;
  }, [activePiece]);

  const getGhostPosition = useCallback(() => {
    if (!activePiece) return 0;
    let dropDistance = 0;
    while (!checkCollision(activePiece, board, { x: 0, y: dropDistance + 1 })) {
      dropDistance += 1;
    }
    return activePiece.pos.y + dropDistance;
  }, [activePiece, board]);

  const generateRandomPiece = () => {
    const typeId = Math.floor(Math.random() * 7) + 1;
    return {
      pos: { x: Math.floor(COLS / 2) - Math.floor(SHAPES[typeId][0].length/2), y: 0 },
      tetromino: SHAPES[typeId],
      colorId: typeId
    };
  };

  const checkCollision = (piece, newBoard, move) => {
    for (let y = 0; y < piece.tetromino.length; y += 1) {
      for (let x = 0; x < piece.tetromino[y].length; x += 1) {
        if (piece.tetromino[y][x] !== 0) {
          if (
            !newBoard[y + piece.pos.y + move.y] ||
            newBoard[y + piece.pos.y + move.y][x + piece.pos.x + move.x] !== 0
          ) {
            return true;
          }
        }
      }
    }
    return false;
  };

  const mergePiece = useCallback((resolvedPiece) => {
    if (!resolvedPiece) return;
    const newBoard = board.map(row => [...row]);
    let merged = false;
    resolvedPiece.tetromino.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value !== 0 && y + resolvedPiece.pos.y >= 0) {
          newBoard[y + resolvedPiece.pos.y][x + resolvedPiece.pos.x] = resolvedPiece.colorId;
          merged = true;
        }
      });
    });
    if (!merged) return;

    let newScore = score;
    const clearedBoard = newBoard.reduce((acc, row) => {
      if (row.every(cell => cell !== 0)) {
        newScore += 100;
        acc.unshift(new Array(COLS).fill(EMPTY));
        return acc;
      }
      acc.push(row);
      return acc;
    }, []);

    setScore(newScore);
    setBoard(clearedBoard);
    setActivePiece(null);
  }, [board, score]);

  const drop = useCallback(() => {
    if (gameState !== 'PLAYING' || !activePiece) return;
    if (!checkCollision(activePiece, board, { x: 0, y: 1 })) {
      setActivePiece(prev => ({
        ...prev,
        pos: { x: prev.pos.x, y: prev.pos.y + 1 }
      }));
    }
  }, [activePiece, board, gameState]);

  const hardDrop = useCallback(() => {
    if (gameState !== 'PLAYING' || !activePiece) return;
    const ghostY = getGhostPosition();
    const finalPiece = { ...activePiece, pos: { ...activePiece.pos, y: ghostY } };
    mergePiece(finalPiece);
  }, [activePiece, gameState, mergePiece, getGhostPosition]);

  const rotateMatrix = (matrix) => {
    const rotated = matrix[0].map((val, index) =>
      matrix.map(row => row[index]).reverse()
    );
    return rotated;
  };

  const handleAction = useCallback((key) => {
    if (gameState !== 'PLAYING' || !activePiece) return;

    if (key === 'ArrowLeft') {
      setActivePiece(prev => {
        if (!prev) return prev;
        if (!checkCollision(prev, board, { x: -1, y: 0 })) {
          return { ...prev, pos: { x: prev.pos.x - 1, y: prev.pos.y } };
        }
        return prev;
      });
    } else if (key === 'ArrowRight') {
      setActivePiece(prev => {
        if (!prev) return prev;
        if (!checkCollision(prev, board, { x: 1, y: 0 })) {
          return { ...prev, pos: { x: prev.pos.x + 1, y: prev.pos.y } };
        }
        return prev;
      });
    } else if (key === 'ArrowDown') {
      drop();
    } else if (key === 'ArrowUp') {
      setActivePiece(prev => {
        if (!prev) return prev;
        const rotatedTetro = rotateMatrix(prev.tetromino);
        let tempPiece = { ...prev, tetromino: rotatedTetro };
        
        if (!checkCollision(tempPiece, board, { x: 0, y: 0 })) return tempPiece;
        if (!checkCollision(tempPiece, board, { x: 1, y: 0 })) return { ...tempPiece, pos: { ...tempPiece.pos, x: tempPiece.pos.x + 1 } };
        if (!checkCollision(tempPiece, board, { x: -1, y: 0 })) return { ...tempPiece, pos: { ...tempPiece.pos, x: tempPiece.pos.x - 1 } };
        if (!checkCollision(tempPiece, board, { x: 2, y: 0 })) return { ...tempPiece, pos: { ...tempPiece.pos, x: tempPiece.pos.x + 2 } };
        if (!checkCollision(tempPiece, board, { x: -2, y: 0 })) return { ...tempPiece, pos: { ...tempPiece.pos, x: tempPiece.pos.x - 2 } };
        if (!checkCollision(tempPiece, board, { x: 0, y: -1 })) return { ...tempPiece, pos: { ...tempPiece.pos, y: tempPiece.pos.y - 1 } };
        if (!checkCollision(tempPiece, board, { x: 0, y: -2 })) return { ...tempPiece, pos: { ...tempPiece.pos, y: tempPiece.pos.y - 2 } };
        
        return prev;
      });
    } else if (key === ' ') {
      hardDrop();
    }
  }, [board, drop, hardDrop, gameState, activePiece]);

  const submitScore = async () => {
    let nameStr = initials.map(i => ALPHABET[i]).join('');
    if (PROFANITY_LIST.includes(nameStr.toUpperCase())) {
      nameStr = '***';
    }

    const timePlayedMs = Date.now() - gameStartTime;
    const payload = { name: nameStr, score, timePlayedMs, date: new Date().toISOString() };

    const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
    const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

    let serverSuccess = false;

    if (SUPABASE_URL && SUPABASE_KEY) {
      try {
        const res = await fetch(`${SUPABASE_URL}/functions/v1/submit-score`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${SUPABASE_KEY}`
          },
          body: JSON.stringify(payload)
        });
        if (res.ok) serverSuccess = true;
      } catch(err) {}
    }

    // LocalStorage tracking fallback
    const cached = JSON.parse(localStorage.getItem('tetrisLeaderboard') || '[]');
    cached.push(payload);
    cached.sort((a,b) => b.score - a.score);
    cached.splice(10); // keep top 10
    localStorage.setItem('tetrisLeaderboard', JSON.stringify(cached));

    setGameState('LEADERBOARD');
  };

  const onKeyDown = useCallback((e) => {
    // Prevent default scrolling 
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " ", "Escape", "Enter"].includes(e.key)) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (e.key === 'Escape') {
      onExit();
      return;
    }

    if (gameState === 'PLAYING') {
      if (e.key.toLowerCase() === 'q') onExit();
      if (!activeKeys.current[e.key]) {
        activeKeys.current[e.key] = Date.now();
        handleAction(e.key);
      }
    } else if (gameState === 'INITIALS') {
      if (e.key === 'ArrowUp') {
        setInitials(prev => prev.map((v, i) => i === cursor ? (v - 1 + ALPHABET.length) % ALPHABET.length : v));
      } else if (e.key === 'ArrowDown') {
        setInitials(prev => prev.map((v, i) => i === cursor ? (v + 1) % ALPHABET.length : v));
      } else if (e.key === 'ArrowLeft') {
        setCursor(c => Math.max(0, c - 1));
      } else if (e.key === 'ArrowRight') {
        setCursor(c => Math.min(2, c + 1));
      } else if (e.key === 'Enter') {
        submitScore();
      }
    } else if (gameState === 'LEADERBOARD') {
      if (e.key === 'Enter' || e.key.toLowerCase() === 'q') {
        onExit(); 
      }
    }
  }, [handleAction, gameState, onExit, cursor, initials, score]);

  const onKeyUp = useCallback((e) => {
    if (activeKeys.current[e.key]) {
      delete activeKeys.current[e.key];
    }
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', onKeyDown, { capture: true });
    document.addEventListener('keyup', onKeyUp, { capture: true });
    return () => {
      document.removeEventListener('keydown', onKeyDown, { capture: true });
      document.removeEventListener('keyup', onKeyUp, { capture: true });
    };
  }, [onKeyDown, onKeyUp]);

  // Load Leaderboard Database
  useEffect(() => {
    if (gameState === 'LEADERBOARD') {
      const fetchScores = async () => {
        setFetchStatus('LOADING');
        const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
        const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

        if (SUPABASE_URL && SUPABASE_KEY) {
          try {
            const res = await fetch(`${SUPABASE_URL}/rest/v1/tetris_leaderboard?select=*&order=score.desc&limit=10`, {
              headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`
              }
            });
            if (res.ok) {
              const data = await res.json();
              setLeaderboardData(data);
              setFetchStatus(data.length > 0 ? 'SUCCESS' : 'EMPTY');
              return;
            } else {
              setFetchStatus('ERROR');
              return;
            }
          } catch(e) {
             setFetchStatus('ERROR');
             return;
          }
        }
        
        // Fallback execution
        const localData = JSON.parse(localStorage.getItem('tetrisLeaderboard') || '[]');
        setLeaderboardData(localData);
        setFetchStatus(localData.length > 0 ? 'FALLBACK' : 'EMPTY');
      };
      fetchScores();
    }
  }, [gameState]);

  // DAS Loop
  useEffect(() => {
    if (gameState !== 'PLAYING') return;
    let animationFrameId;

    const loop = () => {
      const now = Date.now();
      ['ArrowLeft', 'ArrowRight', 'ArrowDown'].forEach(key => {
        const startTime = activeKeys.current[key];
        if (startTime) {
          const elapsed = now - startTime;
          if (elapsed > 150) {
            handleAction(key);
            activeKeys.current[key] = now - 150 + 40; 
          }
        }
      });
      animationFrameId = requestAnimationFrame(loop);
    };
    loop();
    return () => cancelAnimationFrame(animationFrameId);
  }, [handleAction, gameState]);

  // Spawn Engine
  useEffect(() => {
    if (!activePiece && gameState === 'PLAYING') {
      const initPiece = nextPiece || generateRandomPiece();
      setNextPiece(generateRandomPiece());
      
      if (checkCollision(initPiece, board, { x: 0, y: 0 })) {
        if (score > 0) {
          setGameState('INITIALS');
        } else {
          setGameState('LEADERBOARD');
        }
      } else {
        lowestGhostYRef.current = 0;
        setActivePiece(initPiece);
      }
    }
  }, [activePiece, board, gameState, nextPiece]);

  useEffect(() => {
    if (!activePiece) return;
    currentGhostYRef.current = getGhostPosition();
  }, [activePiece, getGhostPosition]);

  // Ghost Sequence Tracker
  useEffect(() => {
    if (gameState !== 'PLAYING' || !activePiece) return;
    const ghostY = currentGhostYRef.current;
    
    // If piece falls into a deeper gap, reset the safety floor and clear the timer
    if (ghostY > lowestGhostYRef.current) {
      lowestGhostYRef.current = ghostY;
      if (lockTimerRef.current) {
        clearTimeout(lockTimerRef.current);
        lockTimerRef.current = null;
      }
    }
  }, [activePiece, gameState]);

  // Lock Delay Engine (Classic Step-Reset)
  useEffect(() => {
    if (gameState !== 'PLAYING' || !activePiece) return;
    
    const isColliding = checkCollision(activePiece, board, { x: 0, y: 1 });
    
    if (isColliding) {
      if (!lockTimerRef.current) {
        lockTimerRef.current = setTimeout(() => {
          if (activePieceRef.current) {
            mergePiece({ ...activePieceRef.current, pos: { ...activePieceRef.current.pos, y: currentGhostYRef.current } });
          }
          lockTimerRef.current = null;
        }, 1000);
      }
    }
  }, [activePiece, board, gameState, mergePiece]);

  // Gravity Tick
  useEffect(() => {
    if (gameState !== 'PLAYING') return;
    const level = Math.floor(score / 500) + 1;
    const speed = Math.max(100, 600 - ((level - 1) * 50));
    
    const interval = setInterval(() => {
      drop();
    }, speed);
    return () => clearInterval(interval);
  }, [drop, gameState, score]);


  // Rendering Modes
  const renderInitialsMenu = () => (
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', zIndex: 10 }}>
      <div className="color-green" style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '20px', textAlign: 'center' }}>NEW HIGH SCORE!</div>
      <div className="color-yellow" style={{ marginBottom: '40px', fontSize: '1.2rem', textAlign: 'center' }}>ENTER INITIALS</div>
      
      <div style={{ display: 'flex', gap: '20px', fontSize: '2.5rem' }}>
        {[0, 1, 2].map(idx => (
          <div key={idx} style={{ 
            color: cursor === idx ? 'var(--term-cyan)' : 'var(--term-fg)', 
            borderBottom: cursor === idx ? '3px solid var(--term-cyan)' : '3px solid transparent',
            paddingBottom: '5px'
          }}>
            {ALPHABET[initials[idx]]}
          </div>
        ))}
      </div>
      <div className="dim" style={{ marginTop: '50px', fontSize: '0.9rem', textAlign: 'center' }}>
        [ARROWS]: CHANGE | [ENTER]: SUBMIT
      </div>
    </div>
  );

  const renderLeaderboardFullscreen = () => (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', fontFamily: 'var(--font-mono)' }}>
      {/* ASCII Banner */}
      <pre className="color-cyan" style={{ fontSize: '1.2vw', fontWeight: 'bold', marginBottom: '10px', textAlign: 'center', lineHeight: '1.1' }}>
        { `
  _______ ______ _______ _____  _____  _____ 
 |__   __|  ____|__   __|  __ \\|_   _|/ ____|
    | |  | |__     | |  | |__) | | | | (___  
    | |  |  __|    | |  |  _  /  | |  \\___ \\ 
    | |  | |____   | |  | | \\ \\ _| |_ ____) |
    |_|  |______|  |_|  |_|  \\_\\_____|_____/ 
        ` }
      </pre>
      <div className="color-yellow" style={{ marginBottom: '30px', fontSize: '1.2rem', letterSpacing: '4px' }}>
        GLOBAL ARCHIVE
      </div>
      
      <div style={{ width: '100%', maxWidth: '500px', display: 'flex', flexDirection: 'column', fontSize: '1.1rem' }}>
        {/* Table Header Wrapper */}
        <div style={{ border: '1px solid var(--term-fg)', padding: '5px', marginBottom: '10px', background: 'var(--term-bg)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 10px', borderBottom: '1px dashed var(--term-fg)', marginBottom: '10px' }}>
            <span className="color-yellow" style={{ flex: '0 0 80px' }}>RNK</span>
            <span className="color-yellow" style={{ flex: '1', textAlign: 'center' }}>OPERATOR</span>
            <span className="color-yellow" style={{ flex: '0 0 100px', textAlign: 'right' }}>PTS</span>
          </div>

          {fetchStatus === 'LOADING' && (
            <div className="dim blink" style={{ textAlign: 'center', padding: '40px 0' }}>Establishing encrypted uplink...</div>
          )}

          {fetchStatus === 'ERROR' && (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
               <div className="color-red blink" style={{ fontWeight: 'bold', marginBottom: '10px' }}>[FATAL SYSTEM EXCEPTION]</div>
               <div className="color-yellow" style={{ fontSize: '0.9rem' }}>CONNECTION REFUSED BY HOST SERVER</div>
            </div>
          )}

          {fetchStatus === 'EMPTY' && (
            <div className="dim" style={{ textAlign: 'center', padding: '40px 0' }}>ARCHIVE EMPTY. NO RECORDS FOUND.</div>
          )}

          {(fetchStatus === 'SUCCESS' || fetchStatus === 'FALLBACK') && (
            leaderboardData.slice(0, 10).map((entry, idx) => (
              <div key={idx} className={idx === 0 ? "rank-one-glow" : ""} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 10px', marginBottom: '5px', background: idx === 0 ? 'rgba(0, 255, 255, 0.1)' : 'transparent' }}>
                <span className={idx === 0 ? "color-cyan" : "color-green"} style={{ flex: '0 0 80px' }}>#{String(idx + 1).padStart(2, '0')}</span>
                <span className={idx === 0 ? "color-white" : "color-cyan"} style={{ flex: '1', textAlign: 'center', letterSpacing: '4px', fontWeight: idx === 0 ? 'bold' : 'normal' }}>{entry.name}</span>
                <span style={{ flex: '0 0 100px', textAlign: 'right', color: idx === 0 ? 'var(--term-cyan)' : 'var(--term-fg)' }}>{String(entry.score).padStart(6, '0')}</span>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="dim" style={{ marginTop: '30px', fontSize: '1.1rem', textAlign: 'center' }}>
        [ENTER]: DISCONNECT
      </div>

      <style>{`
        @keyframes blink { 50% { opacity: 0; } }
        .rank-one-glow {
          box-shadow: 0 0 8px rgba(0, 255, 255, 0.4);
          border-left: 3px solid var(--term-cyan);
        }
      `}</style>
    </div>
  );

  if (gameState === 'LEADERBOARD') {
    return renderLeaderboardFullscreen();
  }

  const level = Math.floor(score / 500) + 1;
  const snakeSpeed = Math.max(0.5, 6 - (level * 0.4));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', height: '100%', padding: '10px 0', fontFamily: 'var(--font-mono)' }}>
      <div style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <pre className="color-cyan" style={{ fontSize: '0.8vw', fontWeight: 'bold', margin: 0, lineHeight: '1.1', textShadow: '0 0 10px rgba(0, 255, 255, 0.5)' }}>
          {`
  _______ ______ _______ _____  _____  _____ 
 |__   __|  ____|__   __|  __ \\|_   _|/ ____|
    | |  | |__     | |  | |__) | | | | (___  
    | |  |  __|    | |  |  _  /  | |  \\___ \\ 
    | |  | |____   | |  | | \\ \\ _| |_ ____) |
    |_|  |______|  |_|  |_|  \\_\\_____|_____/ 
          `}
        </pre>
        <div className="color-yellow" style={{ marginTop: '15px', letterSpacing: '3px', fontWeight: 'bold' }}>TERMINAL EMULATOR v1.0</div>
        <div className="dim" style={{ marginTop: '10px' }}>[ARROWS]: Move/Rotate | [SPACE]: Hard Drop | [ESC]: Quit</div>
      </div>
      
      <div style={{ display: 'flex', gap: '50px', alignItems: 'flex-start', position: 'relative' }}>
        
        {/* Game Area Matrix */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: `repeat(${COLS}, ${CELL_SIZE})`, 
          gridTemplateRows: `repeat(${ROWS}, ${CELL_SIZE})`,
          border: '2px solid var(--term-cyan)', 
          background: '#050505', 
          padding: '2px',
          boxShadow: 'inset 0 0 20px rgba(0,255,255,0.05), 0 0 15px rgba(0, 255, 255, 0.2)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Overlays */}
          {gameState === 'INITIALS' && renderInitialsMenu()}

          {/* Grid Render */}
          {board.map((row, y) => row.map((cell, x) => {
            let pieceCell = 0;
            let isGhost = false;

            if (gameState === 'PLAYING' && activePiece) {
               if (
                 y >= activePiece.pos.y && y < activePiece.pos.y + activePiece.tetromino.length &&
                 x >= activePiece.pos.x && x < activePiece.pos.x + activePiece.tetromino[0].length
               ) {
                 pieceCell = activePiece.tetromino[y - activePiece.pos.y][x - activePiece.pos.x];
               }
               
               if (pieceCell === 0) {
                 const ghostY = getGhostPosition();
                 if (
                   y >= ghostY && y < ghostY + activePiece.tetromino.length &&
                   x >= activePiece.pos.x && x < activePiece.pos.x + activePiece.tetromino[0].length
                 ) {
                   const cellVal = activePiece.tetromino[y - ghostY][x - activePiece.pos.x];
                   if (cellVal !== 0) {
                     pieceCell = cellVal;
                     isGhost = true;
                   }
                 }
               }
            }

            const colorId = cell !== 0 ? cell : (pieceCell !== 0 ? activePiece.colorId : 0);
            
            return (
              <div 
                key={`${y}-${x}`} 
                style={{ 
                  width: CELL_SIZE, 
                  height: CELL_SIZE, 
                  backgroundColor: isGhost ? 'transparent' : COLORS[colorId],
                  borderTop: isGhost ? `2px dashed ${COLORS[colorId]}` : (colorId !== 0 ? `2px solid ${BORDER_COLORS[colorId]}` : '1px solid rgba(255,255,255,0.02)'),
                  borderLeft: isGhost ? `2px dashed ${COLORS[colorId]}` : (colorId !== 0 ? `2px solid ${BORDER_COLORS[colorId]}` : '1px solid rgba(255,255,255,0.02)'),
                  borderBottom: isGhost ? `2px dashed ${COLORS[colorId]}` : (colorId !== 0 ? '2px solid rgba(0,0,0,0.5)' : 'none'),
                  borderRight: isGhost ? `2px dashed ${COLORS[colorId]}` : (colorId !== 0 ? '2px solid rgba(0,0,0,0.5)' : 'none'),
                  boxSizing: 'border-box',
                  opacity: isGhost ? 0.35 : 1
                }} 
              />
            )
          }))}
        </div>

        {/* HUD Overlay */}
        <div style={{ 
          display: 'flex', flexDirection: 'column', gap: '30px', 
          minWidth: '200px', height: '100%',
          borderLeft: '1px dashed rgba(255,255,255,0.2)', 
          paddingLeft: '30px',
          paddingTop: '10px'
        }}>
          
          <div>
            <div className="color-green" style={{ fontWeight: 'bold', marginBottom: '10px', fontSize: '1rem', letterSpacing: '2px' }}>[ NEXT SEQUENCE ]</div>
            <div style={{
              display: 'flex', justifyContent: 'center', alignItems: 'center',
              background: 'rgba(0, 255, 0, 0.03)',
              border: '1px solid rgba(0, 255, 0, 0.3)',
              padding: '15px',
              borderRadius: '2px',
              boxShadow: 'inset 0 0 10px rgba(0,255,0,0.05)',
              minHeight: '80px'
            }}>
              {nextPiece && (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: `repeat(${nextPiece.tetromino[0].length}, ${NEXT_CELL_SIZE})`,
                  gridTemplateRows: `repeat(${nextPiece.tetromino.length}, ${NEXT_CELL_SIZE})`,
                }}>
                  {nextPiece.tetromino.map((row, y) => 
                    row.map((cell, x) => (
                      <div key={`next-${y}-${x}`} style={{
                        width: NEXT_CELL_SIZE, height: NEXT_CELL_SIZE,
                        backgroundColor: cell !== 0 ? COLORS[nextPiece.colorId] : 'transparent',
                        borderTop: cell !== 0 ? `2px solid ${BORDER_COLORS[nextPiece.colorId]}` : 'none',
                        borderLeft: cell !== 0 ? `2px solid ${BORDER_COLORS[nextPiece.colorId]}` : 'none',
                        borderBottom: cell !== 0 ? '2px solid rgba(0,0,0,0.5)' : 'none',
                        borderRight: cell !== 0 ? '2px solid rgba(0,0,0,0.5)' : 'none',
                        boxSizing: 'border-box'
                      }} />
                    ))
                  )}
                </div>
              )}
            </div>
          </div>

          <div style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid var(--term-fg)', padding: '15px', borderRadius: '2px' }}>
             <div className="color-orange" style={{ fontWeight: 'bold', fontSize: '1rem', letterSpacing: '2px' }}>[ OPS LEVEL ]</div>
             <div style={{ fontSize: '2.5rem', marginTop: '8px', color: 'var(--term-cyan)', textShadow: '0 0 8px rgba(0,255,255,0.4)' }}>{level}</div>
          </div>

          <div style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid var(--term-fg)', padding: '15px', borderRadius: '2px' }}>
             <div className="color-orange" style={{ fontWeight: 'bold', fontSize: '1rem', letterSpacing: '2px' }}>[ TELEMETRY ]</div>
             <div style={{ fontSize: '2.5rem', marginTop: '8px', color: 'var(--term-green)', textShadow: '0 0 8px rgba(0,255,0,0.4)' }}>{String(score).padStart(6, '0')}</div>
          </div>
          
          {gameState === 'INITIALS' && (
            <div className="color-yellow" style={{ fontWeight: 'bold', animation: 'blink 1s linear infinite', marginTop: '20px', fontSize: '1.1rem', letterSpacing: '1px', borderTop: '1px dashed var(--term-fg)', paddingTop: '20px' }}>
              [*] WAITING FOR <br/>NETWORK SYNC...
            </div>
          )}
        </div>
      </div>
      <style>{`
        @keyframes blink {
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default TetrisGame;
