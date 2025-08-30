import { BaseDirectory, exists, mkdir } from '@tauri-apps/plugin-fs';

import { logFsError } from './logging';

export const ensureDirInAppData = async (dir: string) => {
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
