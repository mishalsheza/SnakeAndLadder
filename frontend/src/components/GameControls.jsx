import React, { useState } from 'react';

const GameControls = ({ onStart, onRoll, game, message }) => {
    const [p1Name, setP1Name] = useState('Alice');
    const [p2Name, setP2Name] = useState('Bot');

    if (!game) {
        return (
            <div className="controls start-screen">
                <h2>Start Game</h2>
                <input value={p1Name} onChange={e => setP1Name(e.target.value)} placeholder="Player 1" />
                <input value={p2Name} onChange={e => setP2Name(e.target.value)} placeholder="Player 2 (or Bot)" />
                <button onClick={() => onStart([p1Name, p2Name])}>Start Game</button>
            </div>
        );
    }

    return (
        <div className="controls game-active">
            <h3>Turn: {game.currentPlayer.name}</h3>
            {message && <div className="message-log">{message}</div>}
            
            <div className="actions">
                <button onClick={onRoll} disabled={game.finished}>
                    {game.finished ? "Game Over" : "Roll Dice"}
                </button>
            </div>

            {game.winner && (
                <div className="winner-banner">
                    WINNER: {game.winner.name} !!!
                </div>
            )}
            
            <div className="player-list">
                <h4>Players</h4>
                <ul>
                    {game.players.map(p => (
                        <li key={p.name}>
                            {p.name}: {p.position} {p.entered ? "" : "(Start)"}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default GameControls;
