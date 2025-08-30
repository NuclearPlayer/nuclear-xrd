import { error } from '@tauri-apps/plugin-log';

export const logFsError = async (
  scope: string,
  cmd: string,
  targetPath: string,
  err: unknown,
): Promise<void> => {
  const msg = err instanceof Error ? err.message : String(err);
  await error(`[${scope}/fs] ${cmd} failed for ${targetPath}: ${msg}`);
};
