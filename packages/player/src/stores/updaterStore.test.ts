import { check, Update } from '@tauri-apps/plugin-updater';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useUpdaterStore } from './updaterStore';

vi.mock('@tauri-apps/plugin-updater', () => ({
  check: vi.fn(),
}));

describe('useUpdaterStore', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useUpdaterStore.setState({
      isUpdateAvailable: false,
      updateInfo: null,
      lastChecked: null,
      isChecking: false,
      error: null,
    });
  });

  describe('initial state', () => {
    it('starts with no update available', () => {
      const state = useUpdaterStore.getState();
      expect(state.isUpdateAvailable).toBe(false);
      expect(state.updateInfo).toBe(null);
      expect(state.lastChecked).toBe(null);
      expect(state.isChecking).toBe(false);
      expect(state.error).toBe(null);
    });
  });

  describe('checkForUpdate', () => {
    it('sets isChecking to true while checking', async () => {
      vi.mocked(check).mockImplementation(
        () =>
          new Promise((resolve) => {
            setTimeout(() => resolve(null), 10);
          }),
      );

      const checkPromise = useUpdaterStore.getState().checkForUpdate();
      expect(useUpdaterStore.getState().isChecking).toBe(true);
      await checkPromise;
      expect(useUpdaterStore.getState().isChecking).toBe(false);
    });

    it('sets updateAvailable to false when no update', async () => {
      vi.mocked(check).mockResolvedValue(null);

      await useUpdaterStore.getState().checkForUpdate();

      const state = useUpdaterStore.getState();
      expect(state.isUpdateAvailable).toBe(false);
      expect(state.updateInfo).toBe(null);
      expect(state.lastChecked).toBeInstanceOf(Date);
      expect(state.error).toBe(null);
    });

    it('sets updateAvailable to true when update exists', async () => {
      const mockUpdate = {
        version: '1.2.3',
        date: '2025-12-30',
        body: 'New features!',
      } as unknown as Update;

      vi.mocked(check).mockResolvedValue(mockUpdate);

      await useUpdaterStore.getState().checkForUpdate();

      const state = useUpdaterStore.getState();
      expect(state.isUpdateAvailable).toBe(true);
      expect(state.updateInfo).toBe(mockUpdate);
      expect(state.lastChecked).toBeInstanceOf(Date);
      expect(state.error).toBe(null);
    });

    it('stores error when check fails', async () => {
      const error = new Error('Network error');
      vi.mocked(check).mockRejectedValue(error);

      await useUpdaterStore.getState().checkForUpdate();

      const state = useUpdaterStore.getState();
      expect(state.isChecking).toBe(false);
      expect(state.lastChecked).toBeInstanceOf(Date);
      expect(state.error).toEqual('Network error');
      expect(state.isUpdateAvailable).toBe(false);
      expect(state.updateInfo).toBe(null);
    });

    it('clears error on successful check', async () => {
      useUpdaterStore.setState({ error: 'Previous error' });

      vi.mocked(check).mockResolvedValue(null);

      await useUpdaterStore.getState().checkForUpdate();

      const state = useUpdaterStore.getState();
      expect(state.error).toBe(null);
    });
  });
});
