import type { ProviderDescriptor, ProviderKind } from './search';

export type ProvidersHost = {
  register<T extends ProviderDescriptor>(provider: T): string;
  unregister(providerId: string): boolean;
  list<K extends ProviderKind = ProviderKind>(
    kind?: K,
  ): ProviderDescriptor<K>[];
  get<T extends ProviderDescriptor>(providerId: string): T | undefined;
  clear(): void;
};
