import { appDataDir, BaseDirectory, join } from '@tauri-apps/api/path';
import { mkdir, remove } from '@tauri-apps/plugin-fs';

import { logFsError } from '../../utils/logging';
import { ensureDir } from '../../utils/path';

export const PLUGINS_DIR_NAME = 'plugins';

export const getPluginsDir = async (): Promise<string> => {
  const base = await appDataDir();
  return join(base, PLUGINS_DIR_NAME);
};

export const ensurePluginsDir = async (): Promise<string> => {
  return ensureDir(PLUGINS_DIR_NAME);
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
  // Absolute path
  const destination = await getManagedPluginPath(id, version);
  // Relative path - needed for Tauri methods
  const relativeDestination = await join(PLUGINS_DIR_NAME, id, version);

  // Remove existing plugin version if present
  try {
    await remove(relativeDestination, {
      recursive: true,
      baseDir: BaseDirectory.AppData,
    });
  } catch (error) {
    logFsError('plugins', 'fs.remove', relativeDestination, error);
  }

  // Create plugin directory
  try {
    await mkdir(relativeDestination, {
      recursive: true,
      baseDir: BaseDirectory.AppData,
    });
  } catch (e) {
    await logFsError('plugins', 'fs.mkdir', relativeDestination, e);
  }

  await copyDirRecursive(fromPath, destination);
};
