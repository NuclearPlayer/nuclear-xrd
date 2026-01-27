import { appDataDir, join } from '@tauri-apps/api/path';
import { BaseDirectory, remove } from '@tauri-apps/plugin-fs';

import { ensureDir } from '../../utils/path';
import { downloadFile, extractZip } from '../tauri/commands';

const DOWNLOADS_DIR = 'plugins/.downloads';

type DownloadPluginOptions = {
  pluginId: string;
  downloadUrl: string;
};

const getDownloadsDir = async (): Promise<string> => {
  await ensureDir(DOWNLOADS_DIR);
  const base = await appDataDir();
  return join(base, DOWNLOADS_DIR);
};

export const downloadAndExtractPlugin = async ({
  pluginId,
  downloadUrl,
}: DownloadPluginOptions): Promise<string> => {
  const downloadsDir = await getDownloadsDir();
  const zipPath = await join(downloadsDir, `${pluginId}.zip`);
  const extractPath = await join(downloadsDir, pluginId);
  const relativeZipPath = `${DOWNLOADS_DIR}/${pluginId}.zip`;

  await downloadFile(downloadUrl, zipPath);
  await extractZip(zipPath, extractPath);
  await remove(relativeZipPath, { baseDir: BaseDirectory.AppData });

  return extractPath;
};

export const cleanupDownload = async (pluginId: string): Promise<void> => {
  const downloadsDir = await getDownloadsDir();
  const extractPath = await join(downloadsDir, pluginId);

  try {
    await remove(extractPath, { recursive: true });
  } catch {
    // Ignore cleanup errors - directory may not exist
  }
};
