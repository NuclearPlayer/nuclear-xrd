import { ensureDirInAppData } from '../../utils/path';

export const ensurePluginsDir = async (): Promise<string> => {
  return ensureDirInAppData('plugins');
};
