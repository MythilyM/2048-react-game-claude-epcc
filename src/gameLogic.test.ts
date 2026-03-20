import { slideRow, move, isGameOver, hasWon, initBoard, createEmptyBoard } from './gameLogic';

describe('slideRow', () => {
  it('slides tiles to the left', () => {
    expect(slideRow([0, 2, 0, 4]).row).toEqual([2, 4, 0, 0]);
  });

  it('merges equal adjacent tiles', () => {
    const result = slideRow([2, 2, 0, 0]);
    expect(result.row).toEqual([4, 0, 0, 0]);
    expect(result.score).toBe(4);
  });

  it('does not double-merge in one pass', () => {
    const result = slideRow([2, 2, 2, 2]);
    expect(result.row).toEqual([4, 4, 0, 0]);
    expect(result.score).toBe(8);
  });

  it('merges highest pair first (left side)', () => {
    const result = slideRow([2, 2, 4, 0]);
    expect(result.row).toEqual([4, 4, 0, 0]);
    expect(result.score).toBe(4);
  });

  it('returns zero score when no merges', () => {
    expect(slideRow([2, 4, 8, 16]).score).toBe(0);
  });

  it('handles all zeros', () => {
    expect(slideRow([0, 0, 0, 0]).row).toEqual([0, 0, 0, 0]);
  });
});

describe('move', () => {
  it('moves left correctly', () => {
    const board = [
      [0, 2, 0, 2],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    const { board: result, score, moved } = move(board, 'left');
    expect(result[0]).toEqual([4, 0, 0, 0]);
    expect(score).toBe(4);
    expect(moved).toBe(true);
  });

  it('moves right correctly', () => {
    const board = [
      [2, 2, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    const { board: result } = move(board, 'right');
    expect(result[0]).toEqual([0, 0, 0, 4]);
  });

  it('moves up correctly', () => {
    const board = [
      [0, 0, 0, 0],
      [2, 0, 0, 0],
      [2, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    const { board: result } = move(board, 'up');
    expect(result[0][0]).toBe(4);
    expect(result[1][0]).toBe(0);
  });

  it('moves down correctly', () => {
    const board = [
      [2, 0, 0, 0],
      [2, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    const { board: result } = move(board, 'down');
    expect(result[3][0]).toBe(4);
    expect(result[2][0]).toBe(0);
  });

  it('reports moved=false when board does not change', () => {
    const board = [
      [2, 4, 8, 16],
      [32, 64, 128, 256],
      [512, 1024, 2, 4],
      [8, 16, 32, 64],
    ];
    const { moved } = move(board, 'left');
    expect(moved).toBe(false);
  });
});

describe('isGameOver', () => {
  it('returns false when empty cells exist', () => {
    const board = createEmptyBoard();
    expect(isGameOver(board)).toBe(false);
  });

  it('returns false when merges are possible', () => {
    const board = [
      [2, 4, 8, 16],
      [32, 64, 128, 256],
      [512, 1024, 2, 4],
      [8, 16, 32, 32], // last two can merge
    ];
    expect(isGameOver(board)).toBe(false);
  });

  it('returns true when no moves remain', () => {
    const board = [
      [2, 4, 8, 16],
      [32, 64, 128, 256],
      [512, 1024, 2048, 4],
      [8, 16, 32, 64],
    ];
    expect(isGameOver(board)).toBe(true);
  });
});

describe('hasWon', () => {
  it('returns false on a fresh board', () => {
    expect(hasWon(initBoard())).toBe(false);
  });

  it('returns true when 2048 tile exists', () => {
    const board = createEmptyBoard();
    board[0][0] = 2048;
    expect(hasWon(board)).toBe(true);
  });

  it('returns true for tiles above 2048', () => {
    const board = createEmptyBoard();
    board[2][3] = 4096;
    expect(hasWon(board)).toBe(true);
  });
});
