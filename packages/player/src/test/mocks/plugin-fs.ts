import * as fs from '@tauri-apps/plugin-fs';
import { type Mock } from 'vitest';

vi.mock('@tauri-apps/plugin-fs', () => ({
  exists: vi.fn(),
  mkdir: vi.fn(),
  readDir: vi.fn(),
  readTextFile: vi.fn(),
  remove: vi.fn(),
  watch: vi.fn(async (_dir: string, cb: (evt: { paths: string[] }) => void) => {
    watchCb = cb;
    return () => {};
  }),
  BaseDirectory: {
    AppData: '/home/user/.local/share/com.nuclearplayer',
  },
}));

export let watchCb: ((evt: { paths: string[] }) => void) | null = null;

export const PluginFsMock = {
  setReadTextFile: (value: string) => {
    (fs.readTextFile as Mock).mockResolvedValue(value);
    return fs.readTextFile as Mock;
  },
  setExists: (value: boolean) => {
    (fs.exists as Mock).mockResolvedValue(value);
    return fs.exists as Mock;
  },
  setExistsFor: (path: string, baseDir: string, value: boolean) => {
    (fs.exists as Mock).mockImplementation(
      async (
        checkedPath: string,
        { baseDir: checkedBaseDir }: { baseDir: string },
      ) => {
        if (checkedPath === path && checkedBaseDir === baseDir) {
          return value;
        }
        throw new Error('fs.exists called for unknown path');
      },
    );
    return fs.exists as Mock;
  },
  setMkdir: (value: boolean | undefined) => {
    (fs.mkdir as Mock).mockResolvedValue(value);
    return fs.mkdir as Mock;
  },
  setReadDir: (value: Array<{ name: string; isDirectory: boolean }>) => {
    (fs.readDir as Mock).mockResolvedValue(value);
    return fs.readDir as Mock;
  },
  setReadDirError: (error: Error) => {
    (fs.readDir as Mock).mockRejectedValue(error);
    return fs.readDir as Mock;
  },
  setReadTextFileByMap: (value: Record<string, string>) => {
    (fs.readTextFile as Mock).mockImplementation(async (path: string) => {
      const keyToReturn = Object.keys(value).find((key) => {
        if (path.endsWith(key)) {
          return true;
        }
      });

      return keyToReturn ? value[keyToReturn] : '';
    });
  },
  setRemoveFor: (path: string, baseDir: string, value: boolean | undefined) => {
    (fs.remove as Mock).mockImplementation(
      async (
        checkedPath: string,
        { baseDir: checkedBaseDir }: { baseDir: string },
      ) => {
        if (checkedPath === path && checkedBaseDir === baseDir) {
          return value;
        }
        throw new Error('fs.remove called for unknown path');
      },
    );
    return fs.remove as Mock;
  },
};
