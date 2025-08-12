import type { NuclearPlugin } from '@nuclearplayer/plugin-sdk';

export class NuclearPluginBuilder {
  private plugin: NuclearPlugin = {};

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
