import * as Logger from '@tauri-apps/plugin-log';
import { toast } from 'sonner';

export const logFsError = async ({
  scope,
  command,
  targetPath,
  error,
  withToast,
  toastMessage,
}: {
  scope: string;
  command: string;
  targetPath: string;
  error: unknown; // Most often Error or string
  withToast?: boolean;
  toastMessage?: string;
}): Promise<void> => {
  const message = error instanceof Error ? error.message : String(error);

  if (withToast) {
    toast.error(toastMessage, { description: message });
  }

  await Logger.error(
    `[${scope}/fs] ${command} failed for ${targetPath}: ${message}`,
  );
};
