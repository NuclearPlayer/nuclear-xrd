import { PluginManifest } from '@nuclearplayer/plugin-sdk';

type FileMap = Map<string, string>;

const normalize = (p: string) => {
  if (!p) return '/';
  const parts = p.replace(/\\/g, '/').split('/');
  const out: string[] = [];
  for (const part of parts) {
    if (!part || part === '.') continue;
    if (part === '..') out.pop();
    else out.push(part);
  }
  return '/' + out.join('/');
};

export const vfs: FileMap = new Map();

export const resetVfs = () => vfs.clear();

export const writeFile = (path: string, contents: string) => {
  vfs.set(normalize(path), contents);
};

export const joinPath = (...parts: string[]) => normalize(parts.join('/'));

export type PluginFolderOptions = {
  id: string;
  name?: string;
  displayName?: string;
  version?: string;
  description?: string;
  author?: string;
  permissions?: string[];
  main?: string;
  files?: Record<string, string>;
};

export const createPluginFolder = (
  basePath: string,
  opts: PluginFolderOptions,
) => {
  const {
    id,
    name = opts.id,
    displayName,
    version = '1.0.0',
    description = 'Test plugin',
    author = 'Test Author',
    permissions = [],
    main,
    files = {},
  } = opts;

  const pkg: PluginManifest = {
    name: id,
    version,
    description,
    author,
    ...(main ? { main } : {}),
    nuclear: {
      displayName: displayName ?? name,
      permissions,
    },
  };

  writeFile(joinPath(basePath, 'package.json'), JSON.stringify(pkg));

  const entry = main ?? 'index.ts';
  if (!files[entry]) {
    writeFile(joinPath(basePath, entry), 'module.exports = { default: {} };\n');
  }
  for (const [rel, content] of Object.entries(files)) {
    writeFile(joinPath(basePath, rel), content);
  }

  return pkg;
};
