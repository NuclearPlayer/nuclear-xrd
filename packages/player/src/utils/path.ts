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
      } catch (e) {
        await logFsError('ensureDir', 'fs.mkdir', dir, e);
      }
    }
  } catch (e) {
    await logFsError('ensureDir', 'fs.exists', dir, e);
  }
  return dir;
};
