import { ProvidersHost } from '../types/providers';
import type { QueueHost } from '../types/queue';
import type { SettingsHost } from '../types/settings';
import type { StreamingHost } from '../types/streaming';
import { Providers } from './providers';
import { QueueAPI } from './queue';
import { Settings } from './settings';
import { StreamingAPI } from './streaming';

export class NuclearAPI {
  readonly Settings: Settings;
  readonly Providers: Providers;
  readonly Queue: QueueAPI;
  readonly Streaming: StreamingAPI;

  constructor(opts?: {
    settingsHost?: SettingsHost;
    providersHost?: ProvidersHost;
    queueHost?: QueueHost;
    streamingHost?: StreamingHost;
  }) {
    this.Settings = new Settings(opts?.settingsHost);
    this.Providers = new Providers(opts?.providersHost);
    this.Queue = new QueueAPI(opts?.queueHost);
    this.Streaming = new StreamingAPI(opts?.streamingHost);
  }
}

export class NuclearPluginAPI extends NuclearAPI {}
