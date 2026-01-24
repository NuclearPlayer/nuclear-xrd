import * as Logger from '@tauri-apps/plugin-log';
import { check, type Update } from '@tauri-apps/plugin-updater';
import { create } from 'zustand';

import { resolveErrorMessage } from '../utils/logging';
import { getSetting } from './settingsStore';

type UpdaterState = {
  isUpdateAvailable: boolean;
  updateInfo: Update | null;
  lastChecked: Date | null;
  isChecking: boolean;
  isDownloading: boolean;
  isInstalling: boolean;
  downloadProgress: number;
  error: string | null;
  checkForUpdate: () => Promise<void>;
  downloadAndInstall: () => Promise<void>;
};

export const useUpdaterStore = create<UpdaterState>((set, get) => ({
  isUpdateAvailable: false,
  updateInfo: null,
  lastChecked: null,
  isChecking: false,
  isDownloading: false,
  isInstalling: false,
  downloadProgress: 0,
  error: null,

  checkForUpdate: async () => {
    const checkEnabled = getSetting('core.updates.checkForUpdates');
    if (checkEnabled === false) {
      return;
    }

    set({ isChecking: true, error: null });
    try {
      const update = await check();
      set({
        isUpdateAvailable: update !== null,
        updateInfo: update,
        lastChecked: new Date(),
        isChecking: false,
        error: null,
      });

      if (update !== null) {
        const autoInstall = getSetting('core.updates.autoInstall');
        if (autoInstall === true) {
          await get().downloadAndInstall();
        }
      }
    } catch (error) {
      const message = resolveErrorMessage(error);

      Logger.error(`Failed to check for updates: ${message}`);
      set({
        isChecking: false,
        lastChecked: new Date(),
        error: resolveErrorMessage(error),
      });
    }
  },

  downloadAndInstall: async () => {
    const { updateInfo } = get();
    if (!updateInfo) {
      return;
    }

    set({ isDownloading: true, downloadProgress: 0, error: null });
    try {
      await updateInfo.downloadAndInstall((event) => {
        if (event.event === 'Started' && event.data.contentLength) {
          set({ downloadProgress: 0 });
        } else if (event.event === 'Progress') {
          const current = get().downloadProgress + event.data.chunkLength;
          set({ downloadProgress: current });
        } else if (event.event === 'Finished') {
          set({ isDownloading: false, isInstalling: true });
        }
      });
    } catch (error) {
      const message = resolveErrorMessage(error);
      Logger.error(`Failed to download/install update: ${message}`);
      set({
        isDownloading: false,
        isInstalling: false,
        error: message,
      });
    }
  },
}));
