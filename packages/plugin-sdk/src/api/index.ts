import type { SettingsHost, SettingValue } from '../types/settings';
import { SettingsDomain } from './settings';

export class NuclearAPI {
  readonly Settings: SettingsDomain;

  constructor(opts?: { settingsHost?: SettingsHost }) {
    this.Settings = new SettingsDomain(opts?.settingsHost);
  }

  registerSettings(
    defs: Parameters<SettingsDomain['register']>[0],
    source?: Parameters<SettingsDomain['register']>[1],
  ) {
    // source is optional for convenience in plugins
    // plugin hosts can ignore it; core can pass it
    // @ts-expect-error optional source for plugin convenience
    return this.Settings.register(defs, source);
  }

  getSetting<T extends SettingValue = SettingValue>(id: string) {
    return this.Settings.get<T>(id);
  }

  setSetting<T extends SettingValue = SettingValue>(id: string, value: T) {
    return this.Settings.set<T>(id, value);
  }

  onSettingChange<T extends SettingValue = SettingValue>(
    id: string,
    listener: (value: T | undefined) => void,
  ) {
    return this.Settings.subscribe<T>(id, listener);
  }
}

export { SettingsDomain };

export class NuclearPluginAPI extends NuclearAPI {}
