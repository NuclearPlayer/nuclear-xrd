import { NuclearPluginAPI } from './index.js';

describe('NuclearPluginAPI', () => {
  it('should create an instance', () => {
    const api = new NuclearPluginAPI();
    expect(api).toBeInstanceOf(NuclearPluginAPI);
  });
});
