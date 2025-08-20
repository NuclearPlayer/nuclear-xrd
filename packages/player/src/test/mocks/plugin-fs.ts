import * as fs from '@tauri-apps/plugin-fs';
import { Mock } from 'vitest';

vi.mock('@tauri-apps/plugin-fs', () => ({
  exists: vi.fn(),
  mkdir: vi.fn(),
  readDir: vi.fn(),
  readTextFile: vi.fn(),
  watch: vi.fn(async (_dir: string, cb: (evt: { paths: string[] }) => void) => {
    watchCb = cb;
    return () => {};
  }),
}));

export let watchCb: ((evt: { paths: string[] }) => void) | null = null;

export const PluginFsMock = {
  setReadTextFile: (value: string) => {
    (fs.readTextFile as Mock).mockResolvedValue(value);
  },
  setExists: (value: boolean) => {
    (fs.exists as Mock).mockResolvedValue(value);
  },
  setMkdir: (value: boolean | undefined) => {
    (fs.mkdir as Mock).mockResolvedValue(value);
  },
  setReadDir: (value: Array<{ name: string; isDirectory: boolean }>) => {
    (fs.readDir as Mock).mockResolvedValue(value);
  },
  setReadDirError: (error: Error) => {
    (fs.readDir as Mock).mockRejectedValue(error);
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
};
