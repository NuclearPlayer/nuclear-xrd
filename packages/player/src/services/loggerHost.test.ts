import * as tauriLog from '@tauri-apps/plugin-log';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createLoggerHost } from './loggerHost';

vi.mock('@tauri-apps/plugin-log');

describe('loggerHost', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('routes log calls to Tauri logger with plugin prefix', async () => {
    const host = createLoggerHost('test-plugin');

    host.log('trace', 't');
    host.log('debug', 'd');
    host.log('info', 'i');
    host.log('warn', 'w');
    host.log('error', 'e');

    await vi.waitFor(() => {
      expect(tauriLog.trace).toHaveBeenCalledWith('[plugin:test-plugin] t');
      expect(tauriLog.debug).toHaveBeenCalledWith('[plugin:test-plugin] d');
      expect(tauriLog.info).toHaveBeenCalledWith('[plugin:test-plugin] i');
      expect(tauriLog.warn).toHaveBeenCalledWith('[plugin:test-plugin] w');
      expect(tauriLog.error).toHaveBeenCalledWith('[plugin:test-plugin] e');
    });
  });

  it('sanitizes plugin IDs to prevent log spoofing', async () => {
    const host = createLoggerHost('evil] [core');

    host.log('info', 'Trying to spoof');

    await vi.waitFor(() => {
      expect(tauriLog.info).toHaveBeenCalledWith(
        '[plugin:evil_ _core] Trying to spoof',
      );
    });
  });
});
