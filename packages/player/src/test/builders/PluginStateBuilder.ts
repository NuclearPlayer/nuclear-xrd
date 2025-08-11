import type { NuclearPlugin, PluginMetadata } from '@nuclearplayer/plugin-sdk';

import type { PluginState } from '../../stores/pluginStore';

const defaultMetadata: PluginMetadata = {
  id: 'default-plugin',
  name: 'default-plugin',
  displayName: 'Default Plugin',
  version: '1.0.0',
  description: 'Default description',
  author: 'Test Author',
  permissions: [],
};

export class PluginStateBuilder {
  private state: PluginState = {
    metadata: defaultMetadata,
    path: '/path/to/default-plugin',
    status: 'loaded',
  };

  withId(id: string): PluginStateBuilder {
    this.state.metadata = { ...this.state.metadata, id, name: id };
    return this;
  }

  withDisplayName(displayName: string): PluginStateBuilder {
    this.state.metadata = { ...this.state.metadata, displayName };
    return this;
  }

  withVersion(version: string): PluginStateBuilder {
    this.state.metadata = { ...this.state.metadata, version };
    return this;
  }

  withDescription(description: string): PluginStateBuilder {
    this.state.metadata = { ...this.state.metadata, description };
    return this;
  }

  withAuthor(author: string): PluginStateBuilder {
    this.state.metadata = { ...this.state.metadata, author };
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
    return { ...this.state, metadata: { ...this.state.metadata } };
  }
}
