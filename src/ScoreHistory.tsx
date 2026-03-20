import React from 'react';
import { ScoreEntry } from './useScoreHistory';
import './ScoreHistory.css';

interface Props {
  history: ScoreEntry[];
  onClear: () => void;
}

function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return iso; // legacy plain date string
    const today = new Date();
    const isToday =
      d.getFullYear() === today.getFullYear() &&
      d.getMonth() === today.getMonth() &&
      d.getDate() === today.getDate();
    const time = d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    return isToday
      ? `Today at ${time}`
      : `${d.toLocaleDateString([], { month: 'short', day: 'numeric' })} at ${time}`;
  } catch {
    return iso;
  }
}

function ScoreHistory({ history, onClear }: Props) {
  return (
    <aside className="score-history">
      <div className="score-history-header">
        <h2>Score History</h2>
        {history.length > 0 && (
          <button className="clear-btn" onClick={onClear}>
            Clear
          </button>
        )}
      </div>
      {history.length === 0 ? (
        <p className="score-history-empty">No games played yet.</p>
      ) : (
        <ol className="score-history-list">
          {history.map((entry, i) => (
            <li key={i} className={`score-entry score-entry--${entry.result}`}>
              <div className="entry-top">
                <span className="entry-score">{entry.score.toLocaleString()}</span>
                <span className={`entry-result entry-result--${entry.result}`}>
                  {entry.result === 'win' ? '🏆 Win' : '❌ Loss'}
                </span>
              </div>
              <div className="entry-stats">
                {entry.highestTile != null && (
                  <span className="entry-stat">Best tile: <strong>{entry.highestTile}</strong></span>
                )}
                {entry.moves != null && (
                  <span className="entry-stat">{entry.moves} moves</span>
                )}
              </div>
              <span className="entry-date">{formatDate(entry.date)}</span>
            </li>
          ))}
        </ol>
      )}
    </aside>
  );
}

export default ScoreHistory;
