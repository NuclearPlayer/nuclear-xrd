import '@testing-library/jest-dom';

Object.defineProperty(window.HTMLMediaElement.prototype, 'play', {
  writable: true,
  value: vi.fn().mockImplementation(() => Promise.resolve()),
});

Object.defineProperty(window.HTMLMediaElement.prototype, 'pause', {
  writable: true,
  value: vi.fn(),
});

Object.defineProperty(window.HTMLMediaElement.prototype, 'load', {
  writable: true,
  value: vi.fn(),
});

Object.defineProperty(window.HTMLMediaElement.prototype, 'currentTime', {
  writable: true,
  value: 0,
});

Object.defineProperty(window.HTMLMediaElement.prototype, 'duration', {
  writable: true,
  value: 100,
});
