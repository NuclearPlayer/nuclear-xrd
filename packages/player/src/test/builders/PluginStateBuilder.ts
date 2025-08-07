import type { NuclearPlugin } from '@nuclearplayer/plugin-sdk';

import type { PluginState } from '../../stores/pluginStore';

export class PluginStateBuilder {
  private state: PluginState = {
    id: 'default-plugin',
    name: 'Default Plugin',
    version: '1.0.0',
    path: '/path/to/default-plugin',
    status: 'loaded',
  };

  withId(id: string): PluginStateBuilder {
    this.state.id = id;
    return this;
  }

  withName(name: string): PluginStateBuilder {
    this.state.name = name;
    return this;
  }

  withVersion(version: string): PluginStateBuilder {
    this.state.version = version;
    return this;
  }

  withPath(path: string): PluginStateBuilder {
    this.state.path = path;
    return this;
  }

  withStatus(status: PluginState['status']): PluginStateBuilder {
    this.state.status = status;
    return this;
  }

  withError(
    message: string,
    stack?: string,
    timestamp?: number,
  ): PluginStateBuilder {
    this.state.error = {
      message,
      stack,
      timestamp: timestamp || new Date().valueOf(),
    };
    return this;
  }

  withInstance(instance: NuclearPlugin): PluginStateBuilder {
    this.state.instance = instance;
    return this;
  }

  build(): PluginState {
    return { ...this.state };
  }
}
