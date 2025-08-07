import { beforeEach, describe, expect, it } from 'vitest';

import { PluginStateBuilder } from '../test/builders/PluginStateBuilder';
import { usePluginStore, type PluginState } from './pluginStore';

describe('usePluginStore', () => {
  beforeEach(() => {
    usePluginStore.setState({ plugins: {} });
  });

  describe('initial state', () => {
    it('should start with empty plugins record', () => {
      const { plugins } = usePluginStore.getState();
      expect(plugins).toEqual({});
    });
  });

  describe('getPlugin', () => {
    it('should return undefined for non-existent plugin', () => {
      const { getPlugin } = usePluginStore.getState();
      const result = getPlugin('non-existent');
      expect(result).toBeUndefined();
    });

    it('should return plugin state when plugin exists', () => {
      const mockPlugin = new PluginStateBuilder().withId('test-plugin').build();

      usePluginStore.setState({
        plugins: { 'test-plugin': mockPlugin },
      });

      const { getPlugin } = usePluginStore.getState();
      const result = getPlugin('test-plugin');
      expect(result).toEqual(mockPlugin);
    });
  });

  describe('getAllPlugins', () => {
    it('should return empty array when no plugins exist', () => {
      const { getAllPlugins } = usePluginStore.getState();
      const result = getAllPlugins();
      expect(result).toEqual([]);
    });

    it('should return array of all plugin states', () => {
      const mockPlugin1 = new PluginStateBuilder().withId('plugin-1').build();
      const mockPlugin2 = new PluginStateBuilder().withId('plugin-2').build();

      usePluginStore.setState({
        plugins: {
          'plugin-1': mockPlugin1,
          'plugin-2': mockPlugin2,
        },
      });

      const { getAllPlugins } = usePluginStore.getState();
      const result = getAllPlugins();
      expect(result).toHaveLength(2);
      expect(result).toContain(mockPlugin1);
      expect(result).toContain(mockPlugin2);
    });
  });

  describe('PluginState interface', () => {
    it('should support plugin state with error details', () => {
      const errorTimestamp = new Date();
      const pluginWithError = new PluginStateBuilder()
        .withStatus('failed')
        .withError(
          'Plugin crashed during initialization',
          'Error: Plugin crashed\n    at plugin.onLoad',
          errorTimestamp,
        )
        .build();

      usePluginStore.setState({
        plugins: { 'failed-plugin': pluginWithError },
      });

      const { getPlugin } = usePluginStore.getState();
      const result = getPlugin('failed-plugin');

      expect(result?.status).toBe('failed');
      expect(result?.error?.message).toBe(
        'Plugin crashed during initialization',
      );
      expect(result?.error?.stack).toBe(
        'Error: Plugin crashed\n    at plugin.onLoad',
      );
      expect(result?.error?.timestamp).toBe(errorTimestamp);
    });

    it('should support all plugin status values', () => {
      const statuses: PluginState['status'][] = [
        'loaded',
        'enabled',
        'disabled',
        'failed',
      ];

      statuses.forEach((status, index) => {
        const plugin = new PluginStateBuilder()
          .withId(`plugin-${index}`)
          .withStatus(status)
          .build();

        usePluginStore.setState({
          plugins: { [`plugin-${index}`]: plugin },
        });

        const { getPlugin } = usePluginStore.getState();
        const result = getPlugin(`plugin-${index}`);
        expect(result?.status).toBe(status);
      });
    });

    it('should support plugin state with instance', () => {
      const mockInstance = {
        name: 'Test Plugin',
        version: '1.0.0',
        onLoad: () => {},
        onEnable: () => {},
      };

      const pluginWithInstance = new PluginStateBuilder()
        .withInstance(mockInstance)
        .build();

      usePluginStore.setState({
        plugins: { 'plugin-with-instance': pluginWithInstance },
      });

      const { getPlugin } = usePluginStore.getState();
      const result = getPlugin('plugin-with-instance');
      expect(result?.instance).toBe(mockInstance);
    });
  });
});
