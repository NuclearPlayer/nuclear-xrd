import { upsertRegistryEntry } from '../../services/plugins/pluginRegistry';

type SeedParams = {
  id: string;
  version?: string;
  enabled?: boolean;
  installedAt?: string;
  lastUpdatedAt?: string;
  path?: string;
  location?: 'user' | 'bundled' | 'dev';
  warnings?: string[];
};

const managedPathFor = (id: string, version: string) =>
  `/home/user/.local/share/com.nuclearplayer/plugins/${id}/${version}`;

export const seedRegistryEntry = async ({
  id,
  version = '1.0.0',
  enabled = false,
  installedAt = '2025-01-01T00:00:00.000Z',
  lastUpdatedAt = installedAt,
  path,
  location = 'user',
  warnings = [],
}: SeedParams) => {
  await upsertRegistryEntry({
    id,
    version,
    path: path ?? managedPathFor(id, version),
    location,
    enabled,
    installedAt,
    lastUpdatedAt,
    warnings,
  });
};
