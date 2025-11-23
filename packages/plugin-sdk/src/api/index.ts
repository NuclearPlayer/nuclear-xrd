import type { MetadataHost } from '../types/metadata';
import { ProvidersHost } from '../types/providers';
import type { QueueHost } from '../types/queue';
import type { SettingsHost } from '../types/settings';
import type { StreamingHost } from '../types/streaming';
import { MetadataAPI } from './metadata';
import { Providers } from './providers';
import { QueueAPI } from './queue';
import { Settings } from './settings';
import { StreamingAPI } from './streaming';

export class NuclearAPI {
  readonly Settings: Settings;
  readonly Providers: Providers;
  readonly Queue: QueueAPI;
  readonly Streaming: StreamingAPI;
  readonly Metadata: MetadataAPI;

  constructor(opts?: {
    settingsHost?: SettingsHost;
    providersHost?: ProvidersHost;
    queueHost?: QueueHost;
    streamingHost?: StreamingHost;
    metadataHost?: MetadataHost;
  }) {
    this.Settings = new Settings(opts?.settingsHost);
    this.Providers = new Providers(opts?.providersHost);
    this.Queue = new QueueAPI(opts?.queueHost);
    this.Streaming = new StreamingAPI(opts?.streamingHost);
    this.Metadata = new MetadataAPI(opts?.metadataHost);
  }
}

export class NuclearPluginAPI extends NuclearAPI {}
