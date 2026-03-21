// 2048 Game - Built with Claude Code
import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Board,
  Direction,
  initBoard,
  move,
  addRandomTile,
  isGameOver,
  hasWon,
} from "./gameLogic";
import { useScoreHistory } from "./useScoreHistory";
import { detectSwipe } from "./swipeUtils";
import ScoreHistory from "./ScoreHistory";
import "./App.css";

type GameStatus = "playing" | "won" | "lost";

function computeAnimKeys(
  prev: Board,
  next: Board,
): { spawned: Set<string>; merged: Set<string> } {
  const spawned = new Set<string>();
  const merged = new Set<string>();
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      const key = `${r}-${c}`;
      if (prev[r][c] === 0 && next[r][c] !== 0) spawned.add(key);
      else if (prev[r][c] !== 0 && next[r][c] === prev[r][c] * 2)
        merged.add(key);
    }
  }
  return { spawned, merged };
}

function App() {
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    try { return (localStorage.getItem("theme") as "light" | "dark") || "light"; }
    catch { return "light"; }
  });
  const [board, setBoard] = useState<Board>(initBoard);
  const [score, setScore] = useState(0);
  const [scoreAnimKey, setScoreAnimKey] = useState(0);
  const [status, setStatus] = useState<GameStatus>("playing");
  const [moveCount, setMoveCount] = useState(0);
  const [animKeys, setAnimKeys] = useState<{
    spawned: Set<string>;
    merged: Set<string>;
  }>(() => ({ spawned: new Set(), merged: new Set() }));
  const {
    history,
    addEntry,
    clearHistory,
    bestScore,
    newRecord,
    clearNewRecord,
  } = useScoreHistory();
  const gameEndedRef = useRef(false);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    try { localStorage.setItem("theme", theme); } catch {}
  }, [theme]);

  const startNewGame = useCallback(() => {
    setBoard(initBoard());
    setScore(0);
    setStatus("playing");
    setMoveCount(0);
    setAnimKeys({ spawned: new Set(), merged: new Set() });
    gameEndedRef.current = false;
    clearNewRecord();
  }, [clearNewRecord]);

  const handleMove = useCallback(
    (direction: Direction) => {
      if (status !== "playing") return;

      setBoard((prev) => {
        const { board: slid, score: gained, moved } = move(prev, direction);
        if (!moved) return prev;

        const withTile = addRandomTile(slid);
        const { spawned, merged } = computeAnimKeys(prev, withTile);
        setAnimKeys({ spawned, merged });
        setTimeout(
          () => setAnimKeys({ spawned: new Set(), merged: new Set() }),
          200,
        );

        setMoveCount((m) => m + 1);
        setScore((s) => {
          const newScore = s + gained;
          if (gained > 0) setScoreAnimKey((k) => k + 1);
          if (!gameEndedRef.current) {
            const highest = Math.max(...withTile.flat());
            if (hasWon(withTile)) {
              gameEndedRef.current = true;
              setStatus("won");
              addEntry(newScore, "win", moveCount + 1, highest);
            } else if (isGameOver(withTile)) {
              gameEndedRef.current = true;
              setStatus("lost");
              addEntry(newScore, "loss", moveCount + 1, highest);
            }
          }
          return newScore;
        });
        return withTile;
      });
    },
    [status, addEntry, moveCount],
  );

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "n" || e.key === "N") {
        startNewGame();
        return;
      }
      const map: Record<string, Direction> = {
        ArrowLeft: "left",
        ArrowRight: "right",
        ArrowUp: "up",
        ArrowDown: "down",
        a: "left",
        d: "right",
        w: "up",
        s: "down",
      };
      const direction = map[e.key];
      if (!direction) return;
      e.preventDefault();
      handleMove(direction);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleMove, startNewGame]);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    const t = e.touches[0];
    touchStartRef.current = { x: t.clientX, y: t.clientY };
  }, []);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    if (touchStartRef.current) e.preventDefault();
  }, []);

  const onTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (!touchStartRef.current) return;
      const t = e.changedTouches[0];
      const dir = detectSwipe(
        touchStartRef.current.x,
        touchStartRef.current.y,
        t.clientX,
        t.clientY,
      );
      touchStartRef.current = null;
      if (dir) handleMove(dir);
    },
    [handleMove],
  );

  return (
    <div className="app">
      <div className="game-area">
        <div className="game-header">
          <h1 className="game-title">2048</h1>
          <div className="game-controls">
            <div
              className={`score-box${newRecord ? " score-box--record" : ""}`}
              onAnimationEnd={clearNewRecord}
            >
              <span className="score-label">BEST</span>
              <span className="score-value">{bestScore.toLocaleString()}</span>
            </div>
            <div className="score-box">
              <span className="score-label">SCORE</span>
              <span key={scoreAnimKey} className="score-value score-value--bump">{score.toLocaleString()}</span>
            </div>
            <button className="new-game-btn" onClick={startNewGame}>
              New Game
            </button>
            <button
              className="theme-toggle-btn"
              onClick={() => setTheme((t) => (t === "light" ? "dark" : "light"))}
              aria-label="Toggle dark mode"
            >
              {theme === "light" ? "🌙" : "☀️"}
            </button>
          </div>
        </div>

        <div
          className="board"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {board.map((row, r) =>
            row.map((val, c) => {
              const key = `${r}-${c}`;
              const cls = [
                "tile",
                val ? `tile-${val}` : "",
                animKeys.spawned.has(key) ? "tile--spawn" : "",
                animKeys.merged.has(key) ? "tile--merge" : "",
              ]
                .filter(Boolean)
                .join(" ");
              return (
                <div key={key} className={cls}>
                  {val !== 0 ? val : ""}
                </div>
              );
            }),
          )}
        </div>

        <p className="instructions">
          Arrow keys / WASD · Swipe on mobile · N = new game
        </p>

        {status !== "playing" && (
          <div className="overlay">
            <div className="overlay-content">
              <p className="overlay-message">
                {status === "won" ? "🎉 You reached 2048!" : "Game Over!"}
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
