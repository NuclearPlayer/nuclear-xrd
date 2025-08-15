import '@testing-library/jest-dom';

import { vi } from 'vitest';

import { joinPath, readFile } from './utils/testPluginFolder';

type ResizeObserverLike = new (callback: ResizeObserverCallback) => {
  observe(target: Element): void;
  unobserve(target: Element): void;
  disconnect(): void;
};

const g = globalThis as unknown as { ResizeObserver?: ResizeObserverLike };

if (typeof g.ResizeObserver === 'undefined') {
  console.info('[test-setup] Using ResizeObserver mock');
  class ResizeObserverMock {
    constructor(callback: ResizeObserverCallback) {
      void callback; // avoid unused param lint
    }
    observe(target: Element): void {
      void target; // avoid unused param lint
    }
    unobserve(target: Element): void {
      void target; // avoid unused param lint
    }
    disconnect(): void {}
  }
  g.ResizeObserver = ResizeObserverMock;
}

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
