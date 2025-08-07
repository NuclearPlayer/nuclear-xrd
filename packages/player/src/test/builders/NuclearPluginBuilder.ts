import type { NuclearPlugin } from '@nuclearplayer/plugin-sdk';

export class NuclearPluginBuilder {
  private plugin: NuclearPlugin = {
    name: 'Test Plugin',
    version: '1.0.0',
  };

  withName(name: NuclearPlugin['name']): NuclearPluginBuilder {
    this.plugin.name = name;
    return this;
  }

  withVersion(version: NuclearPlugin['version']): NuclearPluginBuilder {
    this.plugin.version = version;
    return this;
  }

  withOnLoad(onLoad: NuclearPlugin['onLoad']): NuclearPluginBuilder {
    this.plugin.onLoad = onLoad;
    return this;
  }

  withOnEnable(onEnable: NuclearPlugin['onEnable']): NuclearPluginBuilder {
    this.plugin.onEnable = onEnable;
    return this;
  }

  withOnDisable(onDisable: NuclearPlugin['onDisable']): NuclearPluginBuilder {
    this.plugin.onDisable = onDisable;
    return this;
  }

  withOnUnload(onUnload: NuclearPlugin['onUnload']): NuclearPluginBuilder {
    this.plugin.onUnload = onUnload;
    return this;
  }

  build(): NuclearPlugin {
    return { ...this.plugin };
  }
}
