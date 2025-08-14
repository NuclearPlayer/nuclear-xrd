import type { SettingsHost } from '../types/settings';
import { Settings } from './settings';

export class NuclearAPI {
  readonly Settings: Settings;

  constructor(opts?: { settingsHost?: SettingsHost }) {
    this.Settings = new Settings(opts?.settingsHost);
  }
}

export class NuclearPluginAPI extends NuclearAPI {}
