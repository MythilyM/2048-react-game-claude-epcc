import { useState, useCallback } from 'react';

export interface ScoreEntry {
  score: number;
  result: 'win' | 'loss';
  date: string; // ISO timestamp
  moves?: number;
  highestTile?: number;
}

const STORAGE_KEY = '2048-score-history';
const BEST_KEY = '2048-best-score';

function loadFromStorage(): ScoreEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function loadBestScore(): number {
  try {
    const raw = localStorage.getItem(BEST_KEY);
    return raw ? parseInt(raw, 10) : 0;
  } catch {
    return 0;
  }
}

function saveToStorage(entries: ScoreEntry[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch {}
}

function saveBestScore(score: number): void {
  try {
    localStorage.setItem(BEST_KEY, String(score));
  } catch {}
}

export function useScoreHistory() {
  const [history, setHistory] = useState<ScoreEntry[]>(loadFromStorage);
  const [bestScore, setBestScore] = useState<number>(loadBestScore);
  const [newRecord, setNewRecord] = useState(false);

  const addEntry = useCallback((
    score: number,
    result: 'win' | 'loss',
    moves?: number,
    highestTile?: number,
  ) => {
    const entry: ScoreEntry = {
      score,
      result,
      date: new Date().toISOString(),
      moves,
      highestTile,
    };
    setHistory(prev => {
      const updated = [entry, ...prev];
      saveToStorage(updated);
      return updated;
    });
    setBestScore(prev => {
      if (score > prev) {
        saveBestScore(score);
        setNewRecord(true);
        return score;
      }
      return prev;
    });
  }, []);

  const clearNewRecord = useCallback(() => setNewRecord(false), []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    saveToStorage([]);
  }, []);

  return { history, addEntry, clearHistory, bestScore, newRecord, clearNewRecord };
}
