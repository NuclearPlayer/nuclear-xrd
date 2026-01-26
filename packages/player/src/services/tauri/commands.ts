import { invoke } from '@tauri-apps/api/core';

export const copyDirRecursive = async (
  from: string,
  to: string,
): Promise<void> => {
  await invoke('copy_dir_recursive', { from, to });
};

export const extractZip = async (
  zipPath: string,
  destPath: string,
): Promise<void> => {
  await invoke('extract_zip', { zipPath, destPath });
};
