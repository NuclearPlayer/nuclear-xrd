import type {
  SettingDefinition,
  SettingsHost,
  SettingSource,
  SettingValue,
} from '../types/settings';

export class NuclearPluginAPI {
  #settings?: SettingsHost;

  constructor(opts?: { settingsHost?: SettingsHost }) {
    this.#settings = opts?.settingsHost;
  }

  async registerSettings(defs: SettingDefinition[], source: SettingSource) {
    if (!this.#settings) throw new Error('Settings host not available');
    return this.#settings.register(defs, source);
  }

  async getSetting<T extends SettingValue = SettingValue>(id: string) {
    if (!this.#settings) throw new Error('Settings host not available');
    return this.#settings.get<T>(id);
  }

  async setSetting<T extends SettingValue = SettingValue>(
    id: string,
    value: T,
  ) {
    if (!this.#settings) throw new Error('Settings host not available');
    return this.#settings.set<T>(id, value);
  }

  onSettingChange<T extends SettingValue = SettingValue>(
    id: string,
    listener: (value: T | undefined) => void,
  ) {
    if (!this.#settings) throw new Error('Settings host not available');
    return this.#settings.subscribe<T>(id, listener);
  }
}
