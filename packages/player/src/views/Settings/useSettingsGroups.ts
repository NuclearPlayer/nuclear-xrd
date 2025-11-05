import groupBy from 'lodash-es/groupBy';
import { useMemo } from 'react';

import type { SettingDefinition } from '@nuclearplayer/plugin-sdk';

import { useSettingsStore } from '../../stores/settingsStore';

export type CategoryGroup = {
  name: string;
  settings: SettingDefinition[];
};

export const useSettingsGroups = (): CategoryGroup[] => {
  const { definitions } = useSettingsStore();

  return useMemo(() => {
    const visibleSettings = Object.values(definitions).filter((d) => !d.hidden);

    const grouped = groupBy(visibleSettings, (d) => d.category);

    return Object.entries(grouped)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([name, settings]) => ({ name, settings }));
  }, [definitions]);
};

export const capitalize = (s: string): string =>
  s.charAt(0).toUpperCase() + s.slice(1);
