import { upsertRegistryEntry } from '../../services/plugins/pluginRegistry';

type SeedParams = {
  id: string;
  version?: string;
  enabled?: boolean;
  installedAt?: string;
  lastUpdatedAt?: string;
  path?: string;
  installationMethod?: 'dev' | 'store';
  originalPath?: string;
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
  installationMethod = 'store',
  originalPath,
  warnings = [],
}: SeedParams) => {
  await upsertRegistryEntry({
    id,
    version,
    path: path ?? managedPathFor(id, version),
    installationMethod,
    originalPath,
    enabled,
    installedAt,
    lastUpdatedAt,
    warnings,
  });
};
