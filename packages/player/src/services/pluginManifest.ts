import { z } from 'zod';

import type { PluginManifest } from '@nuclearplayer/plugin-sdk';

const PluginIconNamedSchema = z
  .object({
    type: z.literal('named'),
    name: z.string().min(1),
    background: z
      .enum([
        'primary',
        'accent-green',
        'accent-yellow',
        'accent-purple',
        'accent-blue',
        'accent-orange',
        'accent-cyan',
        'accent-red',
      ])
      .optional(),
  })
  .strict();

const PluginIconLinkSchema = z
  .object({ type: z.literal('link'), link: z.string().min(1) })
  .strict();

const PluginIconSchema = z.union([PluginIconNamedSchema, PluginIconLinkSchema]);

const NuclearSchema = z
  .object({
    displayName: z.string().min(1).optional(),
    category: z.string().min(1).optional(),
    icon: PluginIconSchema.optional(),
    permissions: z.array(z.string().min(1)).optional(),
  })
  .passthrough();

const PackageJsonSchema = z
  .object({
    name: z.string().min(1),
    version: z.string().min(1),
    description: z.string().min(1),
    author: z.string().min(1),
    main: z.string().min(1).optional(),
    nuclear: NuclearSchema.optional(),
  })
  .passthrough();

export const safeParsePluginManifest = (
  raw: unknown,
):
  | { success: true; data: PluginManifest; warnings: string[] }
  | { success: false; errors: string[]; warnings: string[] } => {
  const warnings: string[] = [];
  const result = PackageJsonSchema.safeParse(raw);
  if (!result.success) {
    const errors = result.error.issues.map(
      (i) => `${i.path.join('.')}: ${i.message}`,
    );
    return { success: false, errors, warnings };
  }

  const data = result.data;

  type NuclearType = NonNullable<PluginManifest['nuclear']>;

  const manifest: PluginManifest = {
    name: data.name.trim(),
    version: data.version.trim(),
    description: data.description.trim(),
    author: data.author.trim(),
    main: data.main?.trim(),
    nuclear: data.nuclear
      ? {
          displayName: data.nuclear.displayName?.trim(),
          category: data.nuclear.category?.trim(),
          icon: data.nuclear.icon as NuclearType['icon'],
          permissions: Array.isArray(data.nuclear.permissions)
            ? Array.from(
                new Set(data.nuclear.permissions.map((p) => p.trim())),
              ).filter((p) => p.length > 0)
            : undefined,
        }
      : undefined,
  };

  return { success: true, data: manifest, warnings };
};

export const parsePluginManifest = (raw: unknown): PluginManifest => {
  const res = safeParsePluginManifest(raw);
  if (res.success) return res.data;
  const msg = res.errors.join('; ');
  throw new Error(`Invalid package.json: ${msg}`);
};
