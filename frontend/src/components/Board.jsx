import React from 'react';
import { SNAKES_AND_LADDERS, BOARD_SIZE, TOTAL_SQUARES } from '../constants';

const Board = ({ players }) => {
  const getCoords = (pos) => {
    // 1-based index
    const zeroIndexed = pos - 1;
    const rFromBottom = Math.floor(zeroIndexed / 10);
    const cFromLeft = zeroIndexed % 10;
    
    const gridRow = 10 - rFromBottom; 
    const isEvenRow = rFromBottom % 2 === 0;
    
    let gridCol;
    if (isEvenRow) {
        gridCol = cFromLeft + 1;
    } else {
        gridCol = 10 - cFromLeft;
    }
    
    return {
        gridRow,
        gridCol,
        x: (gridCol - 0.5) * 10,
        y: (gridRow - 0.5) * 10
    };
  };

  const renderSquare = (index) => {
    const special = SNAKES_AND_LADDERS.find(s => s.start === index);
    const occupyingPlayers = players.filter(p => p.position === index);
    const { gridRow, gridCol } = getCoords(index);
    
    // Improved Visibility Colors
    const bgStyle = (gridRow + gridCol) % 2 === 0 ? 'bg-slate-800/80' : 'bg-slate-900/90';

    return (
      <div 
        key={index}
        className={`w-full h-full border border-slate-600/30 flex flex-col items-center justify-center relative ${bgStyle}`}
        style={{ gridRow, gridColumn: gridCol }}
      >
        {/* Number - Increased Visibility */}
        <span className="absolute top-1 left-1 text-[11px] font-black text-slate-500 select-none opacity-80 z-10">
          {index}
        </span>

        {special && (
            <div className={`absolute inset-0 flex items-center justify-center pointer-events-none opacity-40 text-[10px] uppercase tracking-tighter font-black z-0 scale-75 ${special.type === 'ladder' ? 'text-emerald-400' : 'text-rose-500'}`}>
                {special.type}
            </div>
        )}

        <div className="flex flex-wrap gap-1 items-center justify-center z-20">
          {occupyingPlayers.map(p => (
            <div 
              key={p.name} 
              className={`w-5 h-5 md:w-6 md:h-6 rounded-full border-2 border-white shadow-lg animate-float ${p.color || 'bg-blue-500'}`}
              title={p.name}
            >
             {/* Optional: Add initial/icon to token */}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Generate Squares
  const squares = [];
  for (let i = 1; i <= TOTAL_SQUARES; i++) {
    squares.push(renderSquare(i));
  }

  // Generate SVG Overlay
  const renderOverlay = () => {
     return SNAKES_AND_LADDERS.map((sl, idx) => {
          const start = getCoords(sl.start);
          const end = getCoords(sl.end);
          const color = sl.type === 'ladder' ? '#34d399' : '#fb7185'; // Brighter Emerald / Rose
          
          const midX = (start.x + end.x) / 2 + (sl.type === 'snake' ? 5 : -5);
          const midY = (start.y + end.y) / 2;
          const path = `M ${start.x} ${start.y} Q ${midX} ${midY} ${end.x} ${end.y}`;
          
          return (
            <g key={idx}>
              <path 
                d={path} 
                fill="none" 
                stroke={color} 
                strokeWidth="2.5" 
                strokeDasharray={sl.type === 'snake' ? "4 2" : ""}
                className="opacity-70 drop-shadow-md"
              />
              <circle cx={start.x} cy={start.y} r="1.5" fill={color} className="opacity-90" />
              <circle cx={end.x} cy={end.y} r="1.5" fill={color} className="opacity-90" />
            </g>
          );
     });
  };

  return (
    <div className="relative aspect-square w-full max-w-[600px] border-8 border-slate-700 rounded-xl overflow-hidden shadow-2xl bg-slate-950">
      <div className="grid grid-cols-10 grid-rows-10 w-full h-full">
        {squares}
      </div>

      <svg className="absolute inset-0 pointer-events-none overflow-visible w-full h-full z-10" viewBox="0 0 100 100">
        {renderOverlay()}
      </svg>
    </div>
  );
};

export default Board;
