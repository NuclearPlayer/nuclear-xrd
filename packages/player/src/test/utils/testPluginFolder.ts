import path from 'node:path';

import { PluginManifest } from '@nuclearplayer/plugin-sdk';

import { PluginFsMock } from '../mocks/plugin-fs';

export type PluginFolderOptions = {
  id: string;
  name?: string;
  displayName?: string;
  version?: string;
  description?: string;
  author?: string;
  permissions?: string[];
  main?: string;
};

const AppData = '/home/user/.local/share/com.nuclearplayer';

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
  } = opts;

  const manifest: PluginManifest = {
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

  PluginFsMock.setReadTextFileByMap({
    [path.join(basePath, 'package.json')]: JSON.stringify(manifest),
    [path.join(basePath, main ?? 'index.ts')]:
      'module.exports = { default: {} };',
    [path.join(AppData, 'plugins', id, version, 'package.json')]:
      JSON.stringify(manifest),
    [path.join(AppData, 'plugins', id, version, main ?? 'index.ts')]:
      'module.exports = { default: {} };',
  });
  return manifest;
};
