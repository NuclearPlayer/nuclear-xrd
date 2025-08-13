import type {
  SettingDefinition,
  SettingsHost,
  SettingSource,
  SettingValue,
} from '../types/settings';

export class SettingsDomain {
  #host?: SettingsHost;

  constructor(host?: SettingsHost) {
    this.#host = host;
  }

  #withHost<T>(fn: (host: SettingsHost) => T): T {
    const host = this.#host;
    if (!host) throw new Error('Settings host not available');
    return fn(host);
  }

  register(defs: SettingDefinition[], source: SettingSource) {
    return this.#withHost((h) => h.register(defs, source));
  }

  get<T extends SettingValue = SettingValue>(id: string) {
    return this.#withHost((h) => h.get<T>(id));
  }

  set<T extends SettingValue = SettingValue>(id: string, value: T) {
    return this.#withHost((h) => h.set<T>(id, value));
  }

  subscribe<T extends SettingValue = SettingValue>(
    id: string,
    listener: (value: T | undefined) => void,
  ) {
    return this.#withHost((h) => h.subscribe<T>(id, listener));
  }
}
