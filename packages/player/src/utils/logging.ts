import * as TauriLogger from '@tauri-apps/plugin-log';
import isError from 'lodash-es/isError';
import isString from 'lodash-es/isString';
import { toast } from 'sonner';

import { formatLogValue, Logger, LogScope } from '../services/logger';

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

  await TauriLogger.error(
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

const TOAST_MAX_LENGTH = 100;

const truncateForToast = (message: string): string => {
  if (message.length > TOAST_MAX_LENGTH) {
    return `${message.slice(0, TOAST_MAX_LENGTH)}...`;
  }
  return message;
};

type ReportErrorOptions = {
  userMessage: string;
  error: unknown;
};

export const reportError = async (
  scope: LogScope,
  { userMessage, error }: ReportErrorOptions,
): Promise<void> => {
  const errorMessage = resolveErrorMessage(error);
  const fullLogMessage = `${userMessage}: ${formatLogValue(error)}`;

  await Logger[scope].error(fullLogMessage);

  toast.error(userMessage, {
    description: truncateForToast(errorMessage),
  });
};
