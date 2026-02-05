import { screen } from '@testing-library/react';

import { LogsWrapper } from './Logs.test-wrapper';

vi.mock('@tauri-apps/api/core', () => ({
  invoke: vi.fn().mockResolvedValue([]),
}));

vi.mock('@tauri-apps/plugin-log', () => ({
  attachLogger: vi.fn().mockResolvedValue(() => {}),
  warn: () => Promise.resolve(),
  debug: () => Promise.resolve(),
  trace: () => Promise.resolve(),
  info: () => Promise.resolve(),
  error: () => Promise.resolve(),
}));

describe('Logs view', () => {
  it('renders the Logs view with LogViewer', async () => {
    await LogsWrapper.mount();
    expect(screen.getByRole('searchbox')).toBeInTheDocument();
  });
});
