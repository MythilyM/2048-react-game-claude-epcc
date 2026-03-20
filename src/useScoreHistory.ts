import { useState, useCallback } from 'react';

export interface ScoreEntry {
  score: number;
  result: 'win' | 'loss';
  date: string;
}

const STORAGE_KEY = '2048-score-history';

function loadFromStorage(): ScoreEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveToStorage(entries: ScoreEntry[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch {
    // localStorage unavailable (e.g. private browsing) — silently ignore
  }
}

export function useScoreHistory() {
  const [history, setHistory] = useState<ScoreEntry[]>(loadFromStorage);

  const addEntry = useCallback((score: number, result: 'win' | 'loss') => {
    const entry: ScoreEntry = {
      score,
      result,
      date: new Date().toLocaleDateString(),
    };
    setHistory(prev => {
      const updated = [entry, ...prev];
      saveToStorage(updated);
      return updated;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    saveToStorage([]);
  }, []);

  return { history, addEntry, clearHistory };
}
