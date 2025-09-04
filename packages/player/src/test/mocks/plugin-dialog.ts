import * as dialog from '@tauri-apps/plugin-dialog';
import { type Mock } from 'vitest';

vi.mock('@tauri-apps/plugin-dialog', () => ({
  open: vi.fn(),
}));

export const PluginDialogMock = {
  setOpen: (value: string) => {
    (dialog.open as Mock).mockResolvedValue(value);
  },
};
