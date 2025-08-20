import '@testing-library/jest-dom';

import { vi } from 'vitest';

import { setupResizeObserverMock } from '@nuclearplayer/ui';

import { joinPath, readFile } from './utils/testPluginFolder';

process.env.NODE_ENV = 'test';

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

vi.mock('@tauri-apps/plugin-fs', () => ({
  readTextFile: (path: string) => Promise.resolve(readFile(path)),
}));

vi.mock('@tauri-apps/api/path', () => ({
  join: async (...parts: string[]) => joinPath(...parts),
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
