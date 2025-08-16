import { useMemo } from 'react';

import { defaultTheme } from '@nuclearplayer/themes';
import { ViewShell } from '@nuclearplayer/ui';

import { useCoreSetting } from '../hooks/useCoreSetting';
import { useThemeStore } from '../stores/themeStore';

export const Themes = () => {
  const { setTier, setPrimary } = useThemeStore();
  const [currentPrimary] = useCoreSetting<string>('theme.primary');

  const swatches = useMemo(
    () =>
      [
        defaultTheme.light.primary,
        defaultTheme.light['accent-purple'],
        defaultTheme.light['accent-cyan'],
        defaultTheme.light['accent-green'],
        defaultTheme.light['accent-orange'],
        defaultTheme.light['accent-red'],
        defaultTheme.light['accent-yellow'],
      ].filter(Boolean) as string[],
    [],
  );

  return (
    <ViewShell title="Themes">
      <div className="mt-6 flex flex-col gap-6">
        <section
          aria-labelledby="basic-theme-heading"
          className="flex flex-col gap-3"
        >
          <h2 id="basic-theme-heading" className="text-lg font-semibold">
            Basic theme
          </h2>
          <p className="text-foreground/70 text-sm">
            Pick a primary color. Lightness and chroma come from the default
            theme; only hue is swapped.
          </p>
          <div className="grid max-w-96 grid-cols-[repeat(auto-fill,minmax(44px,1fr))] gap-3">
            {swatches.map((color) => {
              const selected = currentPrimary === color;
              return (
                <button
                  key={color}
                  aria-label={`Select ${color}`}
                  aria-pressed={selected}
                  className={
                    'border-border focus-visible:ring-ring relative h-11 w-11 rounded border-2 transition-shadow outline-none focus-visible:ring-2'
                  }
                  style={{ backgroundColor: color }}
                  onClick={async () => {
                    await setTier('basic');
                    await setPrimary(color);
                  }}
                >
                  {selected && (
                    <span
                      className="ring-border pointer-events-none absolute inset-0 rounded-md ring-2 ring-offset-2"
                      aria-hidden="true"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </section>
      </div>
    </ViewShell>
  );
};
