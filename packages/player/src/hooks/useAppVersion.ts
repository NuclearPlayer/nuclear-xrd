import { getVersion } from '@tauri-apps/api/app';
import { useEffect, useState } from 'react';

import { Logger } from '../services/logger';

export const COMMIT_HASH = __COMMIT_HASH__;

export const useAppVersion = () => {
  const [version, setVersion] = useState<string | null>(null);

  useEffect(() => {
    getVersion()
      .then(setVersion)
      .catch((error) => {
        Logger.app.error(`Failed to get app version: ${error}`);
      });
  }, []);

  return {
    version,
    commitHash: COMMIT_HASH,
  };
};
