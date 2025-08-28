import { appDataDir, join } from '@tauri-apps/api/path';
import { BaseDirectory, exists, mkdir, remove } from '@tauri-apps/plugin-fs';
import { info } from '@tauri-apps/plugin-log';

import { logFsError } from '../utils/logging';
import { copyDirRecursive } from './rustFs';

export const getPluginsDir = async (): Promise<string> => {
  const base = await appDataDir();
  return join(base, 'plugins');
};

export const ensurePluginsDir = async (): Promise<string> => {
  const dir = await getPluginsDir();
  try {
    const present = await exists('plugins', { baseDir: BaseDirectory.AppData });
    if (!present) {
      try {
        await mkdir('plugins', {
          recursive: true,
          baseDir: BaseDirectory.AppData,
        });
      } catch (e) {
        await logFsError('plugins', 'fs.mkdir', dir, e);
      }
    }
  } catch (e) {
    await logFsError('plugins', 'fs.exists', dir, e);
  }
  return dir;
};

export const getManagedPluginPath = async (
  id: string,
  version: string,
): Promise<string> => {
  const base = await ensurePluginsDir();
  const idDir = await join(base, id);
  const versionDir = await join(idDir, version);
  return versionDir;
};

export const installPluginToManagedDir = async (
  id: string,
  version: string,
  fromPath: string,
): Promise<string> => {
  const dest = await getManagedPluginPath(id, version);
  const relDest = await join('plugins', id, version);
  try {
    info(`Checking if plugin exists at ${relDest}`);
    const present = await exists(relDest, { baseDir: BaseDirectory.AppData });
    if (present) {
      try {
        await remove(relDest, {
          recursive: true,
          baseDir: BaseDirectory.AppData,
        });
      } catch (e) {
        await logFsError('plugins', 'fs.remove', dest, e);
        throw e;
      }
    }
  } catch (e) {
    await logFsError('plugins', 'fs.exists', dest, e);
    throw e;
  }
  try {
    await mkdir(relDest, { recursive: true, baseDir: BaseDirectory.AppData });
  } catch (e) {
    await logFsError('plugins', 'fs.mkdir', dest, e);
  }
  await copyDirRecursive(fromPath, dest);
  return dest;
};
