import { LazyStore } from '@tauri-apps/plugin-store';
import type { z } from 'zod';

import { reportError } from '../utils/logging';

export const loadValidated = async <T>(
  store: LazyStore,
  key: string,
  schema: z.ZodType<T, z.ZodTypeDef, unknown>,
): Promise<T | null> => {
  const raw = await store.get<unknown>(key);
  if (raw == null) {
    return null;
  }
  const result = schema.safeParse(raw);
  if (!result.success) {
    await reportError('playlists', {
      userMessage: 'Playlist data is corrupted',
      error: result.error,
    });
    return null;
  }
  return result.data;
};
