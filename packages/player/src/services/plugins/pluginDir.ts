import { appDataDir, BaseDirectory, join } from '@tauri-apps/api/path';
import { mkdir, remove } from '@tauri-apps/plugin-fs';

import { logFsError } from '../../utils/logging';
import { ensureDir } from '../../utils/path';
import { copyDirRecursive } from '../tauri/commands';

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
  // Destination path is relative to the app data directory
  const destination = await getManagedPluginPath(id, version);

  // Remove existing plugin version if present
  try {
    await remove(destination, {
      recursive: true,
      baseDir: BaseDirectory.AppData,
    });
  } catch (error) {
    logFsError('plugins', 'fs.remove', destination, error);
  }

  // Create plugin directory
  try {
    await mkdir(destination, {
      recursive: true,
      baseDir: BaseDirectory.AppData,
    });
  } catch (e) {
    await logFsError('plugins', 'fs.mkdir', destination, e);
  }

  const appData = await appDataDir();
  const absoluteDestination = await join(appData, destination);
  await copyDirRecursive(fromPath, absoluteDestination);
  return absoluteDestination;
};
