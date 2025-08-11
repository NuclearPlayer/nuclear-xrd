import { readTextFile } from '@tauri-apps/plugin-fs';
import * as esbuild from 'esbuild-wasm';

let wasmInitializedUrl: string | null = null;

async function getWasmUrl(): Promise<string> {
  if (wasmInitializedUrl) return wasmInitializedUrl;
  const local = '/esbuild.wasm';
  wasmInitializedUrl = local;
  return wasmInitializedUrl;
}

let initialized = false;
let initPromise: Promise<void> | null = null;
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
  if (initialized) return;
  if (!initPromise) {
    const wasmURL = await getWasmUrl();
    initPromise = esbuild.initialize({ wasmURL, worker: true });
  }
  await initPromise;
  initialized = true;
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
  await ensureInit();
  const entryDir = entryPath.slice(0, entryPath.lastIndexOf('/')) || '/';
  const result = await esbuild.build({
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
            const loader: esbuild.Loader = args.path.endsWith('.tsx')
              ? 'tsx'
              : args.path.endsWith('.ts')
                ? 'ts'
                : 'js';
            return { contents: source, loader };
          });
          build.onResolve({ filter: /^(?!\.).+/ }, (args) => {
            if (args.path === '@nuclearplayer/plugin-sdk') {
              return { path: args.path, external: true };
            }
            return { path: args.path, external: true };
          });
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
