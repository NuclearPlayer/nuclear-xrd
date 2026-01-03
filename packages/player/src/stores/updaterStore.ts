import * as Logger from '@tauri-apps/plugin-log';
import { check, type Update } from '@tauri-apps/plugin-updater';
import { create } from 'zustand';

import { resolveErrorMessage } from '../utils/logging';

type UpdaterState = {
  isUpdateAvailable: boolean;
  updateInfo: Update | null;
  lastChecked: Date | null;
  isChecking: boolean;
  error: string | null;
  checkForUpdate: () => Promise<void>;
};

export const useUpdaterStore = create<UpdaterState>((set) => ({
  isUpdateAvailable: false,
  updateInfo: null,
  lastChecked: null,
  isChecking: false,
  error: null,

  checkForUpdate: async () => {
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
}));
