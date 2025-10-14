import { appDataDir, join } from '@tauri-apps/api/path';
import { BaseDirectory, mkdir, remove } from '@tauri-apps/plugin-fs';

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
    logFsError({
      scope: 'plugins',
      command: 'fs.remove',
      targetPath: destination,
      error,
    });
  }

  // Create plugin directory
  try {
    await mkdir(destination, {
      recursive: true,
      baseDir: BaseDirectory.AppData,
    });
  } catch (error) {
    await logFsError({
      scope: 'plugins',
      command: 'fs.mkdir',
      targetPath: destination,
      error,
      withToast: true,
      toastMessage: 'Failed to create managed plugin directory',
    });
  }

  const appData = await appDataDir();
  const absoluteDestination = await join(appData, destination);
  await copyDirRecursive(fromPath, absoluteDestination);
  return absoluteDestination;
};

const resolveRelativeManagedPath = async (
  absolutePath: string,
): Promise<string | undefined> => {
  const base = await appDataDir();
  if (!absolutePath.startsWith(base)) {
    return undefined;
  }
  const trimmed = absolutePath.slice(base.length).replace(/^[/\\]/, '');
  return trimmed;
};

export const removeManagedPluginInstall = async (
  absolutePath: string,
): Promise<void> => {
  const relative = await resolveRelativeManagedPath(absolutePath);
  if (!relative) {
    throw new Error(
      'Path is not within the managed plugins directory. For safety, refusing to delete.',
    );
  }
  try {
    await remove(relative, {
      recursive: true,
      baseDir: BaseDirectory.AppData,
    });
  } catch (error) {
    await logFsError({
      scope: 'plugins',
      command: 'fs.remove',
      targetPath: absolutePath,
      error,
      withToast: true,
      toastMessage: 'Failed to remove managed plugin directory',
    });
  }
};
