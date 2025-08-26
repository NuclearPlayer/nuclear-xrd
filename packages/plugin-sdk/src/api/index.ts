import { ProvidersHost } from '../types/providers';
import type { SettingsHost } from '../types/settings';
import { Providers } from './providers';
import { Settings } from './settings';

export class NuclearAPI {
  readonly Settings: Settings;
  readonly Providers: Providers;

  constructor(opts?: {
    settingsHost?: SettingsHost;
    providersHost?: ProvidersHost;
  }) {
    this.Settings = new Settings(opts?.settingsHost);
    this.Providers = new Providers(opts?.providersHost);
  }
}

export class NuclearPluginAPI extends NuclearAPI {}
