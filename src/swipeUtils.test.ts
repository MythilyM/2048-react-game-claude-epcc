import { detectSwipe } from './swipeUtils';

test('detects right swipe', () => {
  expect(detectSwipe(0, 0, 50, 0)).toBe('right');
});

test('detects left swipe', () => {
  expect(detectSwipe(50, 0, 0, 0)).toBe('left');
});

test('detects down swipe', () => {
  expect(detectSwipe(0, 0, 0, 50)).toBe('down');
});

test('detects up swipe', () => {
  expect(detectSwipe(0, 50, 0, 0)).toBe('up');
});

test('returns null below threshold', () => {
  expect(detectSwipe(0, 0, 10, 0)).toBeNull();
  expect(detectSwipe(0, 0, 0, 10)).toBeNull();
});

test('diagonal resolves to dominant horizontal axis', () => {
  expect(detectSwipe(0, 0, 40, 20)).toBe('right');
});

test('diagonal resolves to dominant vertical axis', () => {
  expect(detectSwipe(0, 0, 20, 40)).toBe('down');
});
