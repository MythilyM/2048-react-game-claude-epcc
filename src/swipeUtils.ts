import { Direction } from './gameLogic';

export function detectSwipe(
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  threshold = 15,
): Direction | null {
  const dx = endX - startX;
  const dy = endY - startY;
  if (Math.abs(dx) < threshold && Math.abs(dy) < threshold) return null;
  return Math.abs(dx) >= Math.abs(dy)
    ? dx > 0 ? 'right' : 'left'
    : dy > 0 ? 'down' : 'up';
}
