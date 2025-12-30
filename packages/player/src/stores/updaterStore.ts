import { check, type Update } from '@tauri-apps/plugin-updater';
import { create } from 'zustand';

type UpdaterState = {
  isUpdateAvailable: boolean;
  updateInfo: Update | null;
  lastChecked: Date | null;
  isChecking: boolean;
  checkForUpdate: () => Promise<void>;
};

export const useUpdaterStore = create<UpdaterState>((set) => ({
  isUpdateAvailable: false,
  updateInfo: null,
  lastChecked: null,
  isChecking: false,

  checkForUpdate: async () => {
    set({ isChecking: true });
    try {
      const update = await check();
      set({
        isUpdateAvailable: update !== null,
        updateInfo: update,
        lastChecked: new Date(),
        isChecking: false,
      });
    } catch (error) {
      console.error('Failed to check for updates:', error);
      set({
        isChecking: false,
        lastChecked: new Date(),
      });
    }
  },
}));
