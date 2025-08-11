import type { PluginManifest } from '@nuclearplayer/plugin-sdk';

export const parsePluginManifest = (raw: unknown): PluginManifest => {
  if (!raw || typeof raw !== 'object') {
    throw new Error('Invalid package.json');
  }
  const r = raw as Record<string, unknown>;
  const name = r.name;
  const version = r.version;
  const description = r.description;
  const author = r.author;
  if (typeof name !== 'string' || name.length === 0) {
    throw new Error('package.json missing required field: name');
  }
  if (typeof version !== 'string' || version.length === 0) {
    throw new Error('package.json missing required field: version');
  }
  if (typeof description !== 'string' || description.length === 0) {
    throw new Error('package.json missing required field: description');
  }
  if (typeof author !== 'string' || author.length === 0) {
    throw new Error('package.json missing required field: author');
  }
  const main = typeof r.main === 'string' ? (r.main as string) : undefined;
  const nuclearRaw = r.nuclear;
  let nuclear: PluginManifest['nuclear'];
  if (nuclearRaw && typeof nuclearRaw === 'object') {
    const nr = nuclearRaw as Record<string, unknown>;
    nuclear = {
      displayName:
        typeof nr.displayName === 'string' && nr.displayName.length > 0
          ? (nr.displayName as string)
          : undefined,
      category:
        typeof nr.category === 'string' && nr.category.length > 0
          ? (nr.category as string)
          : undefined,
      icon: nr.icon as PluginManifest['nuclear']['icon'],
      permissions: Array.isArray(nr.permissions)
        ? (nr.permissions.filter((p) => typeof p === 'string') as string[])
        : undefined,
    };
  }
  return { name, version, description, author, main, nuclear };
};
