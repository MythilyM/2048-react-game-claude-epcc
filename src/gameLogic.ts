export type Board = number[][];

export function createEmptyBoard(): Board {
  return Array(4)
    .fill(null)
    .map(() => Array(4).fill(0));
}

export function addRandomTile(board: Board): Board {
  const empty: [number, number][] = [];
  for (let r = 0; r < 4; r++)
    for (let c = 0; c < 4; c++) if (board[r][c] === 0) empty.push([r, c]);

  if (empty.length === 0) return board;
  const [r, c] = empty[Math.floor(Math.random() * empty.length)];
  const newBoard = board.map((row) => [...row]);
  newBoard[r][c] = Math.random() < 0.9 ? 2 : 4;
  return newBoard;
}

export function initBoard(): Board {
  let board = createEmptyBoard();
  board = addRandomTile(board);
  board = addRandomTile(board);
  return board;
}

export function slideRow(
  row: number[],
  multiplier: number,
): { row: number[]; score: number } {
  const nums = row.filter((x) => x !== 0);
  let score = 0;
  const merged: number[] = [];
  let i = 0;
  while (i < nums.length) {
    if (i + 1 < nums.length && nums[i] === nums[i + 1]) {
      const val = nums[i] * 2;
      merged.push(val);
      score += val * multiplier;
      i += 2;
    } else {
      merged.push(nums[i]);
      i++;
    }
  }
  while (merged.length < 4) merged.push(0);
  return { row: merged, score };
}

function transpose(board: Board): Board {
  return board[0].map((_, c) => board.map((row) => row[c]));
}

function reverseRows(board: Board): Board {
  return board.map((row) => [...row].reverse());
}

function boardsEqual(a: Board, b: Board): boolean {
  return a.every((row, r) => row.every((val, c) => val === b[r][c]));
}

export type Direction = "left" | "right" | "up" | "down";

export function move(
  board: Board,
  direction: Direction,
): { board: Board; score: number; moved: boolean } {
  let b = board.map((row) => [...row]);

  if (direction === "right") b = reverseRows(b);
  else if (direction === "up") b = transpose(b);
  else if (direction === "down") b = reverseRows(transpose(b));

  const results = b.map((row) => slideRow(row, 1));
  let slid = results.map((r) => r.row);
  const score = results.reduce((s, r) => s + r.score, 0);

  if (direction === "right") slid = reverseRows(slid);
  else if (direction === "up") slid = transpose(slid);
  else if (direction === "down") slid = transpose(reverseRows(slid));

  return { board: slid, score, moved: !boardsEqual(board, slid) };
}

export function isGameOver(board: Board): boolean {
  for (let r = 0; r < 4; r++)
    for (let c = 0; c < 4; c++) {
      if (board[r][c] === 0) return false;
      if (c < 3 && board[r][c] === board[r][c + 1]) return false;
      if (r < 3 && board[r][c] === board[r + 1][c]) return false;
    }
  return true;
}

export function hasWon(board: Board): boolean {
  return board.some((row) => row.some((val) => val >= 2048));
}
