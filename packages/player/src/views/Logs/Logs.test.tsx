import * as path from '@tauri-apps/api/path';
import * as dialog from '@tauri-apps/plugin-dialog';
import * as fs from '@tauri-apps/plugin-fs';
import * as opener from '@tauri-apps/plugin-opener';

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

vi.mock('@tauri-apps/api/path', () => ({
  appLogDir: vi.fn().mockResolvedValue('/path/to/logs'),
}));

vi.mock('@tauri-apps/plugin-opener', () => ({
  revealItemInDir: vi.fn(),
}));

describe('Logs view', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the Logs view with LogViewer', async () => {
    await LogsWrapper.mount();
    expect(LogsWrapper.searchInput).toBeInTheDocument();
  });

  it('exports logs to a file when export button is clicked', async () => {
    vi.mocked(dialog.save).mockResolvedValue('/path/to/logs.txt');
    vi.mocked(fs.writeTextFile).mockResolvedValue(undefined);

    await LogsWrapper.mount();
    await LogsWrapper.exportButton.click();

    expect(dialog.save).toHaveBeenCalled();
    expect(fs.writeTextFile).toHaveBeenCalledWith(
      '/path/to/logs.txt',
      expect.stringContaining('Nuclear'),
    );
  });

  it('does not write file if user cancels save dialog', async () => {
    vi.mocked(dialog.save).mockResolvedValue(null);

    await LogsWrapper.mount();
    await LogsWrapper.exportButton.click();

    expect(dialog.save).toHaveBeenCalled();
    expect(fs.writeTextFile).not.toHaveBeenCalled();
  });

  it('opens log folder when open log folder button is clicked', async () => {
    await LogsWrapper.mount();
    await LogsWrapper.openLogFolderButton.click();

    expect(path.appLogDir).toHaveBeenCalled();
    expect(opener.revealItemInDir).toHaveBeenCalledWith('/path/to/logs');
  });
});
