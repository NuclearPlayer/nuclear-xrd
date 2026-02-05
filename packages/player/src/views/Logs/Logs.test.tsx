import * as dialog from '@tauri-apps/plugin-dialog';
import * as fs from '@tauri-apps/plugin-fs';

import { LogsWrapper } from './Logs.test-wrapper';

vi.mock('@tauri-apps/api/core', () => ({
  invoke: vi.fn().mockResolvedValue([]),
}));

vi.mock('@tauri-apps/api/app', () => ({
  getVersion: vi.fn().mockResolvedValue('1.0.0'),
}));

vi.mock('@tauri-apps/plugin-log', () => ({
  attachLogger: vi.fn().mockResolvedValue(() => {}),
  warn: () => Promise.resolve(),
  debug: () => Promise.resolve(),
  trace: () => Promise.resolve(),
  info: () => Promise.resolve(),
  error: () => Promise.resolve(),
}));

vi.mock('@tauri-apps/plugin-dialog', () => ({
  save: vi.fn(),
}));

vi.mock('@tauri-apps/plugin-fs', () => ({
  writeTextFile: vi.fn(),
}));

describe('Logs view', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the Logs view with LogViewer', async () => {
    await LogsWrapper.mount();
    expect(LogsWrapper.getSearchInput()).toBeInTheDocument();
  });

  it('exports logs to a file when export button is clicked', async () => {
    vi.mocked(dialog.save).mockResolvedValue('/path/to/logs.txt');
    vi.mocked(fs.writeTextFile).mockResolvedValue(undefined);

    await LogsWrapper.mount();
    await LogsWrapper.clickExportButton();

    expect(dialog.save).toHaveBeenCalled();
    expect(fs.writeTextFile).toHaveBeenCalledWith(
      '/path/to/logs.txt',
      expect.stringContaining('Nuclear'),
    );
  });

  it('does not write file if user cancels save dialog', async () => {
    vi.mocked(dialog.save).mockResolvedValue(null);

    await LogsWrapper.mount();
    await LogsWrapper.clickExportButton();

    expect(dialog.save).toHaveBeenCalled();
    expect(fs.writeTextFile).not.toHaveBeenCalled();
  });
});
