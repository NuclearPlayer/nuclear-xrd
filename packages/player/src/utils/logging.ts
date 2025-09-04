import * as Logger from '@tauri-apps/plugin-log';
import isError from 'lodash-es/isError';
import isString from 'lodash-es/isString';
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

export const resolveErrorMessage = (error: unknown): string => {
  if (isError(error)) {
    return error.message;
  }
  if (isString(error)) {
    return error;
  }
  return 'Unknown error';
};
