import { appDataDir, join } from '@tauri-apps/api/path';
import { exists, mkdir, remove } from '@tauri-apps/plugin-fs';

import { logFsError } from '../utils/logging';
import { copyDirRecursive } from './rustFs';

export const getPluginsDir = async (): Promise<string> => {
  const base = await appDataDir();
  return join(base, 'plugins');
};

export const ensurePluginsDir = async (): Promise<string> => {
  const dir = await getPluginsDir();
  try {
    const present = await exists(dir);
    if (!present) {
      try {
        await mkdir(dir, { recursive: true });
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
  try {
    const present = await exists(dest);
    if (present) {
      try {
        await remove(dest, { recursive: true });
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
    await mkdir(dest, { recursive: true });
  } catch (e) {
    await logFsError('plugins', 'fs.mkdir', dest, e);
  }
  await copyDirRecursive(fromPath, dest);
  return dest;
};
