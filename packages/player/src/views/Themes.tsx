import { useMemo } from 'react';

import { listBasicThemes } from '@nuclearplayer/themes';
import { Button, ViewShell } from '@nuclearplayer/ui';

import { useCoreSetting } from '../hooks/useCoreSetting';
import { setAndPersistThemeId } from '../services/themeService';

export const Themes = () => {
  const themes = useMemo(() => listBasicThemes(), []);
  const [selected] = useCoreSetting<string>('theme.id');

  return (
    <ViewShell title="Themes">
      <div className="flex flex-wrap gap-4">
        {themes.map((t) => {
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
    </ViewShell>
  );
};
