import { readTextFile } from '@tauri-apps/plugin-fs';
import type * as EsbuildTypes from 'esbuild-wasm';
import wasmUrl from 'esbuild-wasm/esbuild.wasm?url';

type EsbuildModule = typeof EsbuildTypes & { stop?: () => void };

type EsbuildGlobal = {
  mod: EsbuildModule | null;
  initialized: boolean;
  initPromise: Promise<void> | null;
};

declare global {
  var __NUCLEAR_ESBUILD_WASM__: EsbuildGlobal | undefined;
}

function getEsbuildState(): EsbuildGlobal {
  if (!globalThis.__NUCLEAR_ESBUILD_WASM__) {
    globalThis.__NUCLEAR_ESBUILD_WASM__ = {
      mod: null,
      initialized: false,
      initPromise: null,
    };
  }
  return globalThis.__NUCLEAR_ESBUILD_WASM__;
}

const es = getEsbuildState();

const cache = new Map<string, string>();

const isTs = (p: string) => p.endsWith('.ts') || p.endsWith('.tsx');

const normalize = (parts: string[]) => {
  const out: string[] = [];
  for (const part of parts) {
    if (!part || part === '.') continue;
    if (part === '..') out.pop();
    else out.push(part);
  }
  return '/' + out.join('/');
};

const resolvePath = (baseDir: string, rel: string) => {
  if (rel.startsWith('/')) return rel;
  return normalize((baseDir + '/' + rel).split('/'));
};

async function ensureInit() {
  if (es.initialized) return;
  if (!es.initPromise) {
    es.initPromise = (async () => {
      if (!es.mod) {
        es.mod = await import('esbuild-wasm');
      }
      await es.mod.initialize({ wasmURL: wasmUrl, worker: true });
      es.initialized = true;
    })();
  }
  await es.initPromise;
}

async function getEsbuild(): Promise<EsbuildModule> {
  await ensureInit();
  return es.mod!;
}

/**
 * Returns whether esbuild-wasm has been initialized in this JS context.
 */
export function isEsbuildInitialized(): boolean {
  return es.initialized;
}

/**
 * Resets the shared esbuild-wasm runtime and clears the in-memory bundle cache.
 * Intended for tests or explicit teardown. Safe to call when not initialized.
 */
export async function resetEsbuildCompiler(): Promise<void> {
  // Wait for an in-flight init to settle (ignore errors to ensure teardown)
  if (es.initPromise) {
    try {
      await es.initPromise;
    } catch {
      /* no-op */
    }
  }

  // Stop service if available (esbuild-wasm exposes stop() in some builds)
  try {
    es.mod?.stop?.();
  } catch {
    /* no-op */
  }

  es.mod = null;
  es.initialized = false;
  es.initPromise = null;
  cache.clear();
}

const simpleHash = (str: string) => {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
  return h.toString(16);
};

export async function compilePlugin(
  entryPath: string,
): Promise<string | undefined> {
  if (!isTs(entryPath)) return undefined;
  const entrySource = await readTextFile(entryPath);
  const key = entryPath + ':' + simpleHash(entrySource);
  if (cache.has(key)) return cache.get(key);
  const mod = await getEsbuild();
  const entryDir = entryPath.slice(0, entryPath.lastIndexOf('/')) || '/';
  const result = await mod.build({
    entryPoints: [entryPath],
    bundle: true,
    write: false,
    format: 'cjs',
    platform: 'browser',
    target: ['es2020'],
    sourcemap: 'inline',
    external: ['@nuclearplayer/plugin-sdk'],
    absWorkingDir: '/',
    logLevel: 'silent',
    plugins: [
      {
        name: 'tauri-fs',
        setup(build) {
          build.onResolve({ filter: /^(\.\.?\/).+/ }, (args) => ({
            path: resolvePath(args.resolveDir || entryDir, args.path),
          }));
          build.onLoad({ filter: /\.[tj]sx?$/ }, async (args) => {
            const source =
              args.path === entryPath
                ? entrySource
                : await readTextFile(args.path);
            const loader: EsbuildTypes.Loader = args.path.endsWith('.tsx')
              ? 'tsx'
              : args.path.endsWith('.ts')
                ? 'ts'
                : 'js';
            return { contents: source, loader };
          });
          build.onResolve({ filter: /^[^./].*/ }, (args) => ({
            path: args.path,
            external: true,
          }));
        },
      },
    ],
  });
  if (!result.outputFiles || !result.outputFiles[0]) {
    throw new Error('Plugin compile failed');
  }
  const code = result.outputFiles[0].text;
  cache.set(key, code);
  return code;
}
