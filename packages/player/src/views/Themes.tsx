import { useMemo } from 'react';

import { listBasicThemes } from '@nuclearplayer/themes';
import { Button, Select, ViewShell } from '@nuclearplayer/ui';

import { useCoreSetting } from '../hooks/useCoreSetting';
import { loadAndApplyAdvancedThemeFromFile } from '../services/advancedThemeService';
import {
  resetToDefaultTheme,
  setAndPersistThemeId,
} from '../services/themeService';
import { useAdvancedThemeStore } from '../stores/advancedThemeStore';

export const Themes = () => {
  const basicThemes = useMemo(() => listBasicThemes(), []);
  const [selected] = useCoreSetting<string>('theme.id');
  const { themes } = useAdvancedThemeStore();

  return (
    <ViewShell title="Themes">
      <div className="flex flex-wrap gap-4">
        {basicThemes.map((t) => {
          const isActive = selected === t.id;
          return (
            <Button
              key={t.id}
              size={isActive ? 'lg' : 'default'}
              variant={isActive ? 'default' : 'noShadow'}
              onClick={() => setAndPersistThemeId(t.id)}
            >
              {t.name}
            </Button>
          );
        })}
      </div>
      <div className="mt-6 max-w-120">
        <Select
          label="Advanced themes"
          description="Themes found in your app data themes directory"
          options={[
            { id: '', label: 'Default' },
            ...themes.map((t) => ({ id: t.path, label: t.name })),
          ]}
          onValueChange={async (val) => {
            if (!val) {
              await resetToDefaultTheme();
              return;
            }
            await loadAndApplyAdvancedThemeFromFile(val);
          }}
        />
      </div>
    </ViewShell>
  );
};
