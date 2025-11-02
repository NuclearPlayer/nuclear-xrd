import '@testing-library/jest-dom';

import path from 'node:path';
import { vi } from 'vitest';

import { setupResizeObserverMock } from '@nuclearplayer/ui';

process.env.NODE_ENV = 'test';
process.env.TZ = 'UTC';

setupResizeObserverMock();

// Silences react's pointless warning spam
// give it a rest already
const originalError = console.error;
console.error = (...args) => {
  if (args[0]?.includes?.('was not wrapped in act')) {
    return;
  }
  originalError(...args);
};

vi.mock('@tauri-apps/api/path', () => ({
  appDataDir: async () => '/home/user/.local/share/com.nuclearplayer',
  join: async (...parts: string[]) => path.join(...parts),
}));

vi.mock('esbuild-wasm', () => ({
  initialize: () => Promise.resolve(),
  build: () =>
    Promise.resolve({
      outputFiles: [
        {
          text: 'module.exports = { default: {} };',
        },
      ],
    }),
}));

vi.mock('esbuild-wasm/esbuild.wasm?url', () => ({
  default: '/esbuild.wasm',
}));

vi.mock('@tauri-apps/plugin-dialog', () => ({
  open: () => Promise.resolve(undefined),
}));

vi.mock('@tauri-apps/plugin-log', () => ({
  warn: () => Promise.resolve(),
  debug: () => Promise.resolve(),
  trace: () => Promise.resolve(),
  info: () => Promise.resolve(),
  error: () => Promise.resolve(),
}));

vi.mock('framer-motion', async (importOriginal) => {
  const mod = await importOriginal<typeof import('framer-motion')>();

  // Ugly as shit cross-package import but importing @nuclearplayer/ui here causes tests to hang indefinitely
  const mockMod = await import('../../../ui/src/test/mockFramerMotion');
  const factory = mockMod.createFramerMotionMock;
  return factory(mod);
});

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

const makeAudioContextMock = () => {
  const ctx = {
    currentTime: 0,
    resume: vi.fn(async () => undefined),
    close: vi.fn(async () => undefined),
    createMediaElementSource: () => ({
      connect: () => ({ connect: () => ctx }),
      disconnect: vi.fn(),
    }),
    createGain: () => ({
      connect: () => ctx,
      disconnect: vi.fn(),
      gain: {
        setValueAtTime: vi.fn(),
        linearRampToValueAtTime: vi.fn(),
      },
    }),
    destination: {},
  } as unknown as AudioContext;
  return ctx;
};

(globalThis as unknown as { AudioContext: unknown }).AudioContext = vi.fn(() =>
  makeAudioContextMock(),
) as typeof AudioContext;
