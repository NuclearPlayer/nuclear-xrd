import type { HttpHost } from '../types/http';
import type { MetadataHost } from '../types/metadata';
import { ProvidersHost } from '../types/providers';
import type { QueueHost } from '../types/queue';
import type { SettingsHost } from '../types/settings';
import type { StreamingHost } from '../types/streaming';
import type { YtdlpHost } from '../types/ytdlp';
import { HttpAPI } from './http';
import { MetadataAPI } from './metadata';
import { Providers } from './providers';
import { QueueAPI } from './queue';
import { Settings } from './settings';
import { StreamingAPI } from './streaming';
import { YtdlpAPI } from './ytdlp';

export class NuclearAPI {
  readonly Settings: Settings;
  readonly Providers: Providers;
  readonly Queue: QueueAPI;
  readonly Streaming: StreamingAPI;
  readonly Metadata: MetadataAPI;
  readonly Http: HttpAPI;
  readonly Ytdlp: YtdlpAPI;

  // All these are optional so we don't have to provide all of them in tests
  constructor(opts?: {
    settingsHost?: SettingsHost;
    providersHost?: ProvidersHost;
    queueHost?: QueueHost;
    streamingHost?: StreamingHost;
    metadataHost?: MetadataHost;
    httpHost?: HttpHost;
    ytdlpHost?: YtdlpHost;
  }) {
    this.Settings = new Settings(opts?.settingsHost);
    this.Providers = new Providers(opts?.providersHost);
    this.Queue = new QueueAPI(opts?.queueHost);
    this.Streaming = new StreamingAPI(opts?.streamingHost);
    this.Metadata = new MetadataAPI(opts?.metadataHost);
    this.Http = new HttpAPI(opts?.httpHost);
    this.Ytdlp = new YtdlpAPI(opts?.ytdlpHost);
  }
}

export class NuclearPluginAPI extends NuclearAPI {}
