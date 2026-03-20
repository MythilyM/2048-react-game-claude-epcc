import React from 'react';
import { ScoreEntry } from './useScoreHistory';
import './ScoreHistory.css';

interface Props {
  history: ScoreEntry[];
  onClear: () => void;
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
              <span className="entry-score">{entry.score.toLocaleString()}</span>
              <span className={`entry-result entry-result--${entry.result}`}>
                {entry.result === 'win' ? '🏆 Win' : '❌ Loss'}
              </span>
              <span className="entry-date">{entry.date}</span>
            </li>
          ))}
        </ol>
      )}
    </aside>
  );
}

export default ScoreHistory;
