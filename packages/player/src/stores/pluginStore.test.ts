import { beforeEach, describe, expect, it, vi } from 'vitest';

import { NuclearPluginBuilder } from '../test/builders/NuclearPluginBuilder';
import { PluginStateBuilder } from '../test/builders/PluginStateBuilder';
import { PluginStatus, usePluginStore, type PluginState } from './pluginStore';

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
        plugins: { 'plugin-1': mockPlugin1, 'plugin-2': mockPlugin2 },
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
      const errorTimestamp = new Date().valueOf();
      const pluginWithError = new PluginStateBuilder()
        .withId('failed-plugin')
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

        usePluginStore.setState({ plugins: { [`plugin-${index}`]: plugin } });

        const { getPlugin } = usePluginStore.getState();
        const result = getPlugin(`plugin-${index}`);
        expect(result?.status).toBe(status);
      });
    });

    it('should support plugin state with instance', () => {
      const mockInstance = new NuclearPluginBuilder()
        .withOnLoad(() => {})
        .withOnEnable(() => {})
        .build();

      const pluginWithInstance = new PluginStateBuilder()
        .withId('plugin-with-instance')
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

  describe('lifecycle methods', () => {
    describe.each([
      {
        method: 'enablePlugin' as const,
        validStatuses: ['loaded', 'disabled'] as PluginStatus[],
        targetStatus: 'enabled' as PluginStatus,
        lifecycleMethod: 'onEnable' as const,
        builderMethod: 'withOnEnable' as const,
        hasApi: true,
      },
      {
        method: 'disablePlugin' as const,
        validStatuses: ['enabled'] as PluginStatus[],
        targetStatus: 'disabled' as PluginStatus,
        lifecycleMethod: 'onDisable' as const,
        builderMethod: 'withOnDisable' as const,
        hasApi: false,
      },
    ])(
      '$method',
      ({
        method,
        validStatuses,
        targetStatus,
        lifecycleMethod,
        builderMethod,
        hasApi,
      }) => {
        it.each(validStatuses.map((status) => ({ status })))(
          'should $method a $status plugin and call $lifecycleMethod',
          async ({ status }) => {
            const mockLifecycleMethod = vi.fn();
            const mockInstance = new NuclearPluginBuilder()
              [builderMethod](mockLifecycleMethod)
              .build();

            const plugin = new PluginStateBuilder()
              .withId('test-plugin')
              .withStatus(status)
              .withInstance(mockInstance)
              .build();

            usePluginStore.setState({ plugins: { 'test-plugin': plugin } });

            const store = usePluginStore.getState();
            await store[method]('test-plugin');

            if (hasApi) {
              expect(mockLifecycleMethod).toHaveBeenCalledWith(
                expect.objectContaining({
                  constructor: expect.any(Function),
                }),
              );
            } else {
              expect(mockLifecycleMethod).toHaveBeenCalledWith();
            }

            const { getPlugin } = usePluginStore.getState();
            const result = getPlugin('test-plugin');
            expect(result?.status).toBe(targetStatus);
            expect(result?.error).toBeUndefined();
          },
        );

        it(`should handle ${lifecycleMethod} errors and mark plugin as failed with stack trace`, async () => {
          const date = new Date('2023-01-01T00:00:00.000Z');
          vi.spyOn(global, 'Date').mockImplementation(() => date);
          const testError = new Error(`${lifecycleMethod} failed`);
          const mockLifecycleMethod = vi.fn().mockRejectedValue(testError);
          const mockInstance = new NuclearPluginBuilder()
            [builderMethod](mockLifecycleMethod)
            .build();

          const plugin = new PluginStateBuilder()
            .withId('test-plugin')
            .withStatus(validStatuses[0])
            .withInstance(mockInstance)
            .build();

          usePluginStore.setState({ plugins: { 'test-plugin': plugin } });

          const store = usePluginStore.getState();

          await expect(store[method]('test-plugin')).rejects.toThrow(
            `${lifecycleMethod} failed`,
          );

          const { getPlugin } = usePluginStore.getState();
          const result = getPlugin('test-plugin');
          expect(result?.status).toBe('failed');
          expect(result?.error?.message).toBe(
            `Error: ${lifecycleMethod} failed`,
          );
          expect(result?.error?.stack).toBe(testError.stack);
          expect(result?.error?.timestamp).toBe(1672531200000);
        });
      },
    );

    it.each([
      {
        method: 'enablePlugin' as const,
        status: 'loaded' as const,
        targetStatus: 'enabled' as const,
        lifecycleMethod: 'onEnable' as const,
      },
      {
        method: 'disablePlugin' as const,
        status: 'enabled' as const,
        targetStatus: 'disabled' as const,
        lifecycleMethod: 'onDisable' as const,
      },
    ])(
      'should work when plugin has no $lifecycleMethod method',
      async ({ method, status, targetStatus }) => {
        const mockInstance = new NuclearPluginBuilder().build();

        const plugin = new PluginStateBuilder()
          .withId('test-plugin')
          .withStatus(status)
          .withInstance(mockInstance)
          .build();

        usePluginStore.setState({ plugins: { 'test-plugin': plugin } });

        const store = usePluginStore.getState();
        await store[method]('test-plugin');

        const { getPlugin } = usePluginStore.getState();
        const result = getPlugin('test-plugin');
        expect(result?.status).toBe(targetStatus);
      },
    );

    it.each([
      { method: 'enablePlugin' as const, action: 'enable' },
      { method: 'disablePlugin' as const, action: 'disable' },
    ])('should throw error for non-existent plugin', async ({ method }) => {
      const store = usePluginStore.getState();

      await expect(store[method]('non-existent')).rejects.toThrow(
        'Plugin non-existent not found',
      );
    });

    it.each([
      {
        method: 'enablePlugin' as const,
        status: 'loaded' as const,
      },
      {
        method: 'disablePlugin' as const,
        status: 'enabled' as const,
      },
    ])(
      'should throw error when plugin has no instance ($method)',
      async ({ method, status }) => {
        const plugin = new PluginStateBuilder()
          .withId('test-plugin')
          .withStatus(status)
          .build();

        usePluginStore.setState({ plugins: { 'test-plugin': plugin } });

        const store = usePluginStore.getState();

        await expect(store[method]('test-plugin')).rejects.toThrow(
          `Plugin test-plugin has no instance`,
        );
      },
    );

    it.each([
      {
        method: 'enablePlugin' as const,
        invalidStatuses: ['enabled', 'failed'] as const,
      },
      {
        method: 'disablePlugin' as const,
        invalidStatuses: ['loaded', 'disabled', 'failed'] as const,
      },
    ])(
      'should throw error when plugin cannot be transitioned from invalid status',
      async ({ method, invalidStatuses }) => {
        for (const status of invalidStatuses) {
          const mockInstance = new NuclearPluginBuilder().build();
          const plugin = new PluginStateBuilder()
            .withId('test-plugin')
            .withStatus(status)
            .withInstance(mockInstance)
            .build();

          usePluginStore.setState({ plugins: { 'test-plugin': plugin } });

          const store = usePluginStore.getState();
          const targetStatus =
            method === 'enablePlugin' ? 'enabled' : 'disabled';

          await expect(store[method]('test-plugin')).rejects.toThrow(
            `Plugin test-plugin cannot be ${targetStatus} from status: ${status}`,
          );
        }
      },
    );

    describe('unloadPlugin', () => {
      it('should unload a loaded plugin and call onUnload', async () => {
        const mockOnUnload = vi.fn();
        const mockInstance = new NuclearPluginBuilder()
          .withOnUnload(mockOnUnload)
          .build();

        const plugin = new PluginStateBuilder()
          .withId('test-plugin')
          .withStatus('loaded')
          .withInstance(mockInstance)
          .build();

        usePluginStore.setState({ plugins: { 'test-plugin': plugin } });

        const { unloadPlugin } = usePluginStore.getState();
        await unloadPlugin('test-plugin');

        expect(mockOnUnload).toHaveBeenCalled();

        const { getPlugin } = usePluginStore.getState();
        const result = getPlugin('test-plugin');
        expect(result).toBeUndefined();
      });

      it('should disable enabled plugin before unloading', async () => {
        const mockOnDisable = vi.fn();
        const mockOnUnload = vi.fn();
        const mockInstance = new NuclearPluginBuilder()
          .withOnDisable(mockOnDisable)
          .withOnUnload(mockOnUnload)
          .build();

        const plugin = new PluginStateBuilder()
          .withId('test-plugin')
          .withStatus('enabled')
          .withInstance(mockInstance)
          .build();

        usePluginStore.setState({ plugins: { 'test-plugin': plugin } });

        const { unloadPlugin } = usePluginStore.getState();
        await unloadPlugin('test-plugin');

        expect(mockOnDisable).toHaveBeenCalled();
        expect(mockOnUnload).toHaveBeenCalled();

        const { getPlugin } = usePluginStore.getState();
        const result = getPlugin('test-plugin');
        expect(result).toBeUndefined();
      });

      it('should work when plugin has no onUnload method', async () => {
        const mockInstance = new NuclearPluginBuilder().build();

        const plugin = new PluginStateBuilder()
          .withId('test-plugin')
          .withStatus('loaded')
          .withInstance(mockInstance)
          .build();

        usePluginStore.setState({ plugins: { 'test-plugin': plugin } });

        const { unloadPlugin } = usePluginStore.getState();
        await unloadPlugin('test-plugin');

        const { getPlugin } = usePluginStore.getState();
        const result = getPlugin('test-plugin');
        expect(result).toBeUndefined();
      });

      it('should throw error for non-existent plugin', async () => {
        const { unloadPlugin } = usePluginStore.getState();

        await expect(unloadPlugin('non-existent')).rejects.toThrow(
          'Plugin non-existent not found',
        );
      });

      it('should always remove plugin even if onUnload fails', async () => {
        const testError = new Error('Unload failed');
        const mockOnUnload = vi.fn().mockRejectedValue(testError);
        const mockInstance = new NuclearPluginBuilder()
          .withOnUnload(mockOnUnload)
          .build();

        const plugin = new PluginStateBuilder()
          .withId('test-plugin')
          .withStatus('loaded')
          .withInstance(mockInstance)
          .build();

        usePluginStore.setState({ plugins: { 'test-plugin': plugin } });

        const { unloadPlugin } = usePluginStore.getState();

        await expect(unloadPlugin('test-plugin')).rejects.toThrow(
          'Unload failed',
        );

        const { getPlugin } = usePluginStore.getState();
        const result = getPlugin('test-plugin');
        expect(result).toBeUndefined();
      });

      it('should always remove plugin even if disable fails during unload', async () => {
        const testError = new Error('Disable failed');
        const mockOnDisable = vi.fn().mockRejectedValue(testError);
        const mockInstance = new NuclearPluginBuilder()
          .withOnDisable(mockOnDisable)
          .build();

        const plugin = new PluginStateBuilder()
          .withId('test-plugin')
          .withStatus('enabled')
          .withInstance(mockInstance)
          .build();

        usePluginStore.setState({ plugins: { 'test-plugin': plugin } });

        const { unloadPlugin } = usePluginStore.getState();

        await expect(unloadPlugin('test-plugin')).rejects.toThrow(
          'Disable failed',
        );

        const { getPlugin } = usePluginStore.getState();
        const result = getPlugin('test-plugin');
        expect(result).toBeUndefined();
      });
    });
  });
});
