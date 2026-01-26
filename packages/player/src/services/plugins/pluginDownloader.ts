import { appDataDir, join } from '@tauri-apps/api/path';
import { remove } from '@tauri-apps/plugin-fs';
import { download } from '@tauri-apps/plugin-upload';

import { ensureDir } from '../../utils/path';
import { extractZip } from '../tauri/commands';

const DOWNLOADS_DIR = 'plugins/.downloads';

type DownloadProgress = {
  progress: number;
  total: number;
  transferSpeed: number;
};

type DownloadPluginOptions = {
  pluginId: string;
  downloadUrl: string;
  onProgress?: (progress: DownloadProgress) => void;
};

const getDownloadsDir = async (): Promise<string> => {
  await ensureDir(DOWNLOADS_DIR);
  const base = await appDataDir();
  return join(base, DOWNLOADS_DIR);
};

export const downloadAndExtractPlugin = async ({
  pluginId,
  downloadUrl,
  onProgress,
}: DownloadPluginOptions): Promise<string> => {
  const downloadsDir = await getDownloadsDir();
  const zipPath = await join(downloadsDir, `${pluginId}.zip`);
  const extractPath = await join(downloadsDir, pluginId);

  await download(downloadUrl, zipPath, (payload) => {
    onProgress?.({
      progress: payload.progress,
      total: payload.total,
      transferSpeed: payload.transferSpeed,
    });
  });

  await extractZip(zipPath, extractPath);

  await remove(zipPath);

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
