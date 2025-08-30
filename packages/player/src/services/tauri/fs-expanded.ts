import { invoke } from '@tauri-apps/api/core';

export const copyDirRecursive = async (
  from: string,
  to: string,
): Promise<void> => {
  await invoke('copy_dir_recursive', { from, to });
};
