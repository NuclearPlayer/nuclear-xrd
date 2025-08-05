import { NuclearPluginAPI } from './index.js';

describe('NuclearPluginAPI', () => {
  it('should respond to ping with pong', async () => {
    const api = new NuclearPluginAPI();
    const result = await api.ping();
    expect(result).toBe('pong');
  });
});
