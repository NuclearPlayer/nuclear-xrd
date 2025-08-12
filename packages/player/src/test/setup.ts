import '@testing-library/jest-dom';

import { vi } from 'vitest';

import { joinPath, readFile } from './utils/testPluginFolder';

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
