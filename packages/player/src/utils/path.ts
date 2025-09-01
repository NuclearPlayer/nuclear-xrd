import { BaseDirectory, exists, mkdir } from '@tauri-apps/plugin-fs';

import { logFsError } from './logging';

export const ensureDir = async (
  dir: string,
  baseDir: BaseDirectory = BaseDirectory.AppData,
) => {
  try {
    const present = await exists(dir, { baseDir });
    if (!present) {
      try {
        await mkdir(dir, {
          recursive: true,
          baseDir,
        });
      } catch (error) {
        await logFsError({
          scope: 'ensureDir',
          command: 'fs.mkdir',
          targetPath: dir,
          error,
          withToast: true,
          toastMessage: `Failed to create directory ${dir}`,
        });
      }
    }
  } catch (error) {
    await logFsError({
      scope: 'ensureDir',
      command: 'fs.exists',
      targetPath: dir,
      error,
    });
  }
  return dir;
};
