import React, { useState, useEffect, useRef } from 'react';
import Board from './components/Board';
import Dice3D from './components/Dice3D';
import { startGame, rollDice } from './api/gameApi';
import { SNAKES_AND_LADDERS } from './constants';
import './App.css';

function App() {
  const [isSetup, setIsSetup] = useState(true);
  const [setupStep, setSetupStep] = useState('mode'); // 'mode' or 'names'
  const [playerNames, setPlayerNames] = useState({ p1: 'Player 1', p2: 'Player 2' });
  
  // Visual Game State
  const [gameState, setGameState] = useState({
    players: [], 
    currentPlayerIndex: 0,
    lastRoll: 1,
    winner: null,
    history: [],
    isRolling: false,
  });

  const [backendGame, setBackendGame] = useState(null);
  const isMovingRef = useRef(false);

  const addHistory = (message, type = 'info') => {
    setGameState(prev => ({
      ...prev,
      history: [{ id: Math.random().toString(), message, type }, ...prev.history].slice(0, 50)
    }));
  };

  const delay = (ms) => new Promise(r => setTimeout(r, ms));

  // The Core Move Animation
  const animateMove = async (playerIdx, rollVal, finalPos) => {
    if (isMovingRef.current) return;
    isMovingRef.current = true;

    const players = [...gameState.players];
    const player = players[playerIdx];
    const startPos = player.position;
    
    // 2. Step-by-Step
    let curr = startPos;
    
    // Handle Enter Board logic
    if (curr === 0) {
        if (rollVal === 1 || rollVal === 6) {
             curr = 1;
             players[playerIdx].position = 1;
             players[playerIdx].entered = true;
             setGameState(prev => ({ ...prev, players: [...players] }));
             await delay(300);
             addHistory(`${player.name} enters the board!`, 'move');
        } else {
             addHistory(`${player.name} needs a 1 or 6 to enter.`, 'info');
             isMovingRef.current = false;
             return; 
        }
    }
    
    let stepTarget = curr + rollVal; 

    // Fix: If we just entered (startPos was 0), we stay at 1. We don't add the roll.
    if (startPos === 0) {
        stepTarget = 1;
    }
    
    if (stepTarget > 100) {
        addHistory(`${player.name} overshot!`, 'info');
        stepTarget = curr; // no move
    }
    
    while (curr < stepTarget && curr < 100) {
        curr++;
        players[playerIdx].position = curr;
        setGameState(prev => ({ ...prev, players: [...players] }));
        await delay(200);
    }
    
    if (curr !== finalPos) {
        await delay(500);
        const jumpedTo = finalPos;
        const isSnake = jumpedTo < curr;
        const type = isSnake ? 'snake' : 'ladder';
        
        players[playerIdx].position = jumpedTo;
        setGameState(prev => ({ ...prev, players: [...players] }));
        
        addHistory(`${player.name} triggered a ${type}!`, type);
        await delay(500);
    } else {
        if (curr === 100) {
             addHistory(`${player.name} HAS WON!`, 'win');
             setGameState(prev => ({ ...prev, winner: player }));
        } else {
             if (!player.entered && startPos === 0 && curr === 0) {
                 // Already handled
             } else {
                 addHistory(`${player.name} moves to ${curr}`, 'move');
             }
        }
    }
    
    isMovingRef.current = false;
  };

  const handleRoll = async () => {
    if (gameState.isRolling || gameState.winner || isMovingRef.current) return;
    
    const turningPlayerIdx = gameState.currentPlayerIndex;

    setGameState(prev => ({ ...prev, isRolling: true }));
    
    try {
        const res = await rollDice();
        const msgParts = res.message.split(' ');
        const rollVal = parseInt(msgParts[msgParts.indexOf("rolled") + 1]) || 1;
        
        await delay(1200); 
        
        setGameState(prev => ({ ...prev, isRolling: false, lastRoll: rollVal }));
        
        // Wait for dice to settle and show number
        await delay(1500);
        
        const backendPlayer = res.game.players[turningPlayerIdx];
        const finalPos = backendPlayer.position;
        
        await animateMove(turningPlayerIdx, rollVal, finalPos);
        
        if (!backendGame?.finished && !res.game.finished) {
           setGameState(prev => ({
               ...prev,
               currentPlayerIndex: res.game.currentIndex
           }));
        }
        
        setBackendGame(res.game);

    } catch (e) {
        console.error("Roll Error", e);
        setGameState(prev => ({ ...prev, isRolling: false }));
        addHistory("Roll failed by the gods.", "error");
    }
  };

  // Start Logic for 2 Modes
  const initGame = async (mode, pNames = null) => {
      // mode: 'single' | 'multi'
      let names;
      if (mode === 'single') {
          names = ['Player 1', 'Bot'];
      } else {
          names = pNames || ['Player 1', 'Player 2'];
      }
      
      try {
        const backendRes = await startGame(names, false);
        setBackendGame(backendRes);
        
        const visualPlayers = backendRes.players.map((bp, i) => ({
            ...bp,
            // Custom config based on mode
            color: i === 0 ? 'bg-emerald-500' : (mode === 'single' ? 'bg-rose-500' : 'bg-blue-500'),
            isAI: mode === 'single' && i === 1,
            id: i + 1,
            name: bp.name // backend name
        }));

        setGameState(prev => ({
            ...prev,
            players: visualPlayers,
            currentPlayerIndex: 0,
            winner: null,
            history: []
        }));
        setIsSetup(false);
        setSetupStep('mode'); // Reset setup for next time
      } catch (e) {
        console.error(e);
      }
  };

  const startMultiplayerSetup = () => {
      setSetupStep('names');
      setPlayerNames({ p1: 'Player 1', p2: 'Player 2' });
  };

  const handleReset = () => {
      setIsSetup(true);
      setBackendGame(null);
  };

  // Bot Auto Roll
  useEffect(() => {
    if (!isSetup && !gameState.winner && !gameState.isRolling && !isMovingRef.current) {
        const currentPlayer = gameState.players[gameState.currentPlayerIndex];
        if (currentPlayer && currentPlayer.isAI) {
            const timer = setTimeout(() => {
                handleRoll();
            }, 1500);
            return () => clearTimeout(timer);
        }
    }
  }, [gameState.currentPlayerIndex, gameState.isRolling, isMovingRef.current, isSetup, gameState.winner]);

  if (isSetup) {
    return (
      <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-6 font-outfit text-white">
        <div className="glass p-10 rounded-3xl max-w-2xl w-full shadow-2xl space-y-8 animate-in text-center relative overflow-hidden">
          
          <header className="space-y-4 relative z-10">
            <h1 className="text-6xl font-cinzel font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500 drop-shadow-lg">
              Mythic Journey
            </h1>
            <p className="text-slate-400 text-sm tracking-[0.3em] uppercase">Choose your Path</p>
          </header>

          {setupStep === 'mode' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8 relative z-10">
                {/* Single Player Card */}
                <div 
                    className="group p-8 rounded-3xl border border-slate-700 bg-slate-900/40 hover:bg-slate-800/60 hover:border-emerald-500/50 cursor-pointer transition-all duration-300 flex flex-col items-center gap-4 hover:scale-105 shadow-xl"
                    onClick={() => initGame('single')}
                >
                    <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center text-3xl mb-2 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                        ⚔️
                    </div>
                    <h3 className="font-cinzel font-bold text-2xl text-white">Single Player</h3>
                    <p className="text-slate-400 text-sm">Challenge the Automaton</p>
                </div>

                {/* Multiplayer Card */}
                <div 
                    className="group p-8 rounded-3xl border border-slate-700 bg-slate-900/40 hover:bg-slate-800/60 hover:border-blue-500/50 cursor-pointer transition-all duration-300 flex flex-col items-center gap-4 hover:scale-105 shadow-xl"
                    onClick={startMultiplayerSetup}
                >
                    <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center text-3xl mb-2 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                        👥
                    </div>
                    <h3 className="font-cinzel font-bold text-2xl text-white">Multiplayer</h3>
                    <p className="text-slate-400 text-sm">Face a Human Rival</p>
                </div>
            </div>
          ) : (
              <div className="space-y-6 relative z-10 animate-in fade-in">
                  <div className="space-y-4 text-left">
                      <div>
                          <label className="block text-xs font-bold uppercase tracking-widest text-emerald-400 mb-1">Player 1 Name</label>
                          <input 
                            type="text" 
                            value={playerNames.p1}
                            onChange={(e) => setPlayerNames(p => ({...p, p1: e.target.value}))}
                            className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                          />
                      </div>
                      <div>
                          <label className="block text-xs font-bold uppercase tracking-widest text-blue-400 mb-1">Player 2 Name</label>
                          <input 
                            type="text" 
                            value={playerNames.p2}
                            onChange={(e) => setPlayerNames(p => ({...p, p2: e.target.value}))}
                            className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                          />
                      </div>
                  </div>
                  
                  <div className="flex gap-4 pt-4">
                      <button 
                        onClick={() => setSetupStep('mode')}
                        className="flex-1 py-3 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-400 font-bold transition-colors"
                      >
                          Back
                      </button>
                      <button 
                        onClick={() => initGame('multi', [playerNames.p1 || 'Player 1', playerNames.p2 || 'Player 2'])}
                        className="flex-[2] py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 text-white font-bold shadow-lg hover:brightness-110 transition-all font-cinzel"
                      >
                          Start Adventure
                      </button>
                  </div>
              </div>
          )}
        </div>
      </div>
    );
  }

  const currentPlayer = gameState.players[gameState.currentPlayerIndex];

  return (
    <div className="min-h-screen bg-[#020617] flex flex-col items-center p-4 md:p-8 overflow-hidden font-outfit text-white">
       {/* (Keeping the Header) */}
       <header className="mb-6 text-center">
        <h1 className="text-4xl md:text-5xl font-cinzel font-black text-white tracking-tighter drop-shadow-2xl">
          Snakes <span className="text-emerald-500">&</span> Ladders
        </h1>
        <div className="h-1 w-24 bg-gradient-to-r from-transparent via-emerald-500 to-transparent mx-auto mt-2" />
      </header>

      <main className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-8 relative">
        {/* Left: Info */}
        <div className="lg:col-span-3 space-y-6">
             <div className="glass p-6 rounded-2xl shadow-xl">
                 <h3 className="text-emerald-400 font-cinzel font-bold mb-4 uppercase text-xs tracking-widest flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    Active Turn
                </h3>
                <div className={`p-4 rounded-xl border-2 transition-all duration-500 ${currentPlayer?.color} border-white/20 shadow-lg`}>
                    <div className="text-white font-black text-xl flex justify-between items-center">
                        {currentPlayer?.name}
                        <span className="text-[10px] bg-black/40 px-2 py-1 rounded font-mono">SQ {Math.floor(currentPlayer?.position || 0)}</span>
                    </div>
                </div>
                <div className="mt-8 space-y-3">
                    {gameState.players.map(p => (
                        <div key={p.id} className={`flex items-center justify-between p-3 rounded-lg border transition-all ${p.id === currentPlayer?.id ? 'bg-slate-800/80 border-slate-600 translate-x-1' : 'bg-slate-900/40 border-slate-800/50'}`}>
                            <div className="flex items-center gap-3">
                                <div className={`w-3 h-3 rounded-full ${p.color}`} />
                                <span className={`text-xs font-bold ${p.id === currentPlayer?.id ? 'text-white' : 'text-slate-500'}`}>
                                {p.name}
                                </span>
                            </div>
                            <span className="text-[10px] font-mono text-slate-400">{Math.floor(p.position)}/100</span>
                        </div>
                    ))}
                </div>
             </div>
        </div>

        {/* Center: Board */}
        <div className="lg:col-span-6 flex flex-col items-center">
           <Board players={gameState.players} />
           
           <div className="mt-8 flex flex-col items-center gap-6">
                <Dice3D rolling={gameState.isRolling} value={gameState.lastRoll} />
                <button
                    onClick={handleRoll}
                    disabled={!!gameState.winner || currentPlayer?.isAI || isMovingRef.current || gameState.isRolling}
                    className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-emerald-800 rounded-full font-cinzel font-bold text-lg shadow-lg hover:scale-105 disabled:opacity-50 disabled:grayscale transition-all"
                >
                    {gameState.isRolling ? "Rolling..." : "Roll Dice"}
                </button>
           </div>
           
           {/* Winner Modal */}
             {gameState.winner && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-6">
                <div className="glass p-12 rounded-[3rem] text-center space-y-6 border-emerald-500/30 animate-in zoom-in-50 duration-500">
                  <div className="text-emerald-400 font-cinzel font-black text-5xl uppercase tracking-tighter">Victory!</div>
                  <div className="text-white font-black text-4xl">{gameState.winner.name} wins</div>
                  <button 
                    onClick={handleReset}
                    className="bg-emerald-500 text-white px-10 py-4 rounded-full font-cinzel font-black text-xl hover:bg-emerald-400 transition-all shadow-xl shadow-emerald-500/20"
                  >
                    Play Again
                  </button>
                </div>
              </div>
            )}
        </div>

        {/* Right: History */}
        <div className="lg:col-span-3 glass border border-white/5 rounded-2xl p-6 shadow-xl h-[600px] flex flex-col">
            <h3 className="text-slate-500 font-cinzel font-bold mb-4 uppercase text-[10px] tracking-widest flex items-center justify-between">
                Chronicles
                <button onClick={handleReset} className="text-[9px] bg-slate-800/50 hover:bg-slate-700 px-2 py-1 rounded transition-all">EXIT</button>
            </h3>
            <div className="flex-1 overflow-y-auto space-y-2 pr-2">
                 {gameState.history.map((log) => (
                    <div key={log.id} className="p-3 bg-slate-800/20 border border-slate-700/30 text-[11px] text-slate-300 rounded-xl animate-in fade-in">
                        <div className="flex justify-between mb-1">
                            <span className={`font-black px-1.5 py-0.5 rounded text-[9px] uppercase ${
                                log.type === 'win' ? 'bg-emerald-500/20 text-emerald-400' :
                                log.type === 'ladder' ? 'bg-cyan-500/20 text-cyan-400' :
                                log.type === 'snake' ? 'bg-rose-500/20 text-rose-400' :
                                'bg-slate-700/20 text-slate-500'
                            }`}>
                                {log.type}
                            </span>
                        </div>
                        {log.message}
                    </div>
                ))}
            </div>
        </div>

      </main>

      <footer className="mt-auto py-6 text-slate-600 text-[9px] font-bold tracking-[0.3em] uppercase opacity-40">
        Mythic Board Engine
      </footer>
    </div>
  );
}

export default App;
