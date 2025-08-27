import { invoke } from '@tauri-apps/api/core';

export const copyDirRecursive = async (
  from: string,
  to: string,
): Promise<void> => {
  await invoke('copy_dir_recursive', { from, to });
};

export const readTextFileUnrestricted = async (
  path: string,
): Promise<string> => {
  const content = await invoke<string>('read_text_file_unrestricted', { path });
  return content;
};
