export const TOTAL_SQUARES = 100;
export const BOARD_SIZE = 10;

// Must match Backend Board.java exactly
export const SNAKES_AND_LADDERS = [
  // Ladders
  { start: 2, end: 38, type: 'ladder' },
  { start: 7, end: 14, type: 'ladder' },
  { start: 8, end: 31, type: 'ladder' },
  { start: 15, end: 26, type: 'ladder' },
  { start: 21, end: 42, type: 'ladder' },
  { start: 28, end: 84, type: 'ladder' },
  { start: 36, end: 44, type: 'ladder' },
  { start: 51, end: 67, type: 'ladder' },
  { start: 71, end: 91, type: 'ladder' },
  { start: 78, end: 98, type: 'ladder' },
  { start: 87, end: 94, type: 'ladder' },
  
  // Snakes
  { start: 16, end: 6, type: 'snake' },
  { start: 46, end: 25, type: 'snake' },
  { start: 49, end: 11, type: 'snake' },
  { start: 62, end: 19, type: 'snake' },
  { start: 64, end: 60, type: 'snake' },
  { start: 74, end: 53, type: 'snake' },
  { start: 89, end: 68, type: 'snake' },
  { start: 92, end: 88, type: 'snake' },
  { start: 95, end: 75, type: 'snake' },
  { start: 99, end: 80, type: 'snake' },
];

export const PLAYER_CONFIGS = [
  { id: 1, name: 'Hero', color: 'bg-emerald-500', isAI: false },
  { id: 2, name: 'Rival', color: 'bg-rose-500', isAI: true }, // Default Bot
];
