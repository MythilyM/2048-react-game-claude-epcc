import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the game title', () => {
  render(<App />);
  expect(screen.getByText('2048')).toBeInTheDocument();
});

test('renders the score box', () => {
  render(<App />);
  expect(screen.getByText('SCORE')).toBeInTheDocument();
});

test('renders new game button', () => {
  render(<App />);
  expect(screen.getByText('New Game')).toBeInTheDocument();
});

test('renders score history sidebar', () => {
  render(<App />);
  expect(screen.getByText('Score History')).toBeInTheDocument();
});
