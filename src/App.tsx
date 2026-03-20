import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Board, Direction, initBoard, move, addRandomTile, isGameOver, hasWon } from './gameLogic';
import { useScoreHistory } from './useScoreHistory';
import ScoreHistory from './ScoreHistory';
import './App.css';

type GameStatus = 'playing' | 'won' | 'lost';

function App() {
  const [board, setBoard] = useState<Board>(initBoard);
  const [score, setScore] = useState(0);
  const [status, setStatus] = useState<GameStatus>('playing');
  const { history, addEntry, clearHistory } = useScoreHistory();
  const gameEndedRef = useRef(false);

  const startNewGame = useCallback(() => {
    setBoard(initBoard());
    setScore(0);
    setStatus('playing');
    gameEndedRef.current = false;
  }, []);

  const handleMove = useCallback((direction: Direction) => {
    if (status !== 'playing') return;

    setBoard(prev => {
      const { board: next, score: gained, moved } = move(prev, direction);
      if (!moved) return prev;

      const withTile = addRandomTile(next);
      setScore(s => {
        const newScore = s + gained;
        if (!gameEndedRef.current) {
          if (hasWon(withTile)) {
            gameEndedRef.current = true;
            setStatus('won');
            addEntry(newScore, 'win');
          } else if (isGameOver(withTile)) {
            gameEndedRef.current = true;
            setStatus('lost');
            addEntry(newScore, 'loss');
          }
        }
        return newScore;
      });
      return withTile;
    });
  }, [status, addEntry]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const map: Record<string, Direction> = {
        ArrowLeft: 'left', ArrowRight: 'right',
        ArrowUp: 'up', ArrowDown: 'down',
        a: 'left', d: 'right', w: 'up', s: 'down',
      };
      const direction = map[e.key];
      if (!direction) return;
      e.preventDefault();
      handleMove(direction);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleMove]);

  return (
    <div className="app">
      <div className="game-area">
        <div className="game-header">
          <h1 className="game-title">2048</h1>
          <div className="game-controls">
            <div className="score-box">
              <span className="score-label">SCORE</span>
              <span className="score-value">{score.toLocaleString()}</span>
            </div>
            <button className="new-game-btn" onClick={startNewGame}>
              New Game
            </button>
          </div>
        </div>

        <div className="board">
          {board.map((row, r) =>
            row.map((val, c) => (
              <div
                key={`${r}-${c}`}
                className={`tile${val ? ` tile-${val}` : ''}`}
              >
                {val !== 0 ? val : ''}
              </div>
            ))
          )}
        </div>

        <p className="instructions">Use arrow keys or WASD to play.</p>

        {status !== 'playing' && (
          <div className="overlay">
            <div className="overlay-content">
              <p className="overlay-message">
                {status === 'won' ? '🎉 You reached 2048!' : 'Game Over!'}
              </p>
              <button className="new-game-btn" onClick={startNewGame}>
                Play Again
              </button>
            </div>
          </div>
        )}
      </div>

      <ScoreHistory history={history} onClear={clearHistory} />
    </div>
  );
}

export default App;
