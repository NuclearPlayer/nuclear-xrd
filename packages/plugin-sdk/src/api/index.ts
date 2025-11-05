import { ProvidersHost } from '../types/providers';
import type { QueueHost } from '../types/queue';
import type { SettingsHost } from '../types/settings';
import { Providers } from './providers';
import { QueueAPI } from './queue';
import { Settings } from './settings';

export class NuclearAPI {
  readonly Settings: Settings;
  readonly Providers: Providers;
  readonly Queue: QueueAPI;

  constructor(opts?: {
    settingsHost?: SettingsHost;
    providersHost?: ProvidersHost;
    queueHost?: QueueHost;
  }) {
    this.Settings = new Settings(opts?.settingsHost);
    this.Providers = new Providers(opts?.providersHost);
    this.Queue = new QueueAPI(opts?.queueHost);
  }
}

export class NuclearPluginAPI extends NuclearAPI {}
