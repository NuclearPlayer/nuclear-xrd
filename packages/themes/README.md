# @nuclearplayer/themes

Theme engine utilities for Nuclear. Tailwind v4 consumes CSS custom properties from `@nuclearplayer/tailwind-config/global.css`. All runtime theming is done by swapping CSS variables; no tokens are duplicated in TS.

- Basic themes are CSS files that override four variables via `data-theme-id` on `:root`.
- Advanced themes are JSON files parsed at runtime and injected as a single `<style id="advanced-theme">`.
- Dark mode is controlled exclusively by `[data-theme='dark']`.

## Public API

- `listBasicThemes()` → built-in themes metadata
- `setBasicTheme(id)` → sets `data-theme-id` on `documentElement`
- `applyAdvancedTheme(theme)` → validates and injects CSS for vars/dark
- `clearAdvancedTheme()` → removes the injected style tag

Built-in basic theme IDs are namespaced with `nuclear:` to avoid collisions.

## Advanced theme JSON (v1)

```json
{
  "version": 1,
  "name": "My Theme",
  "vars": { "background": "oklch(...)" },
  "dark": { "background": "oklch(...)" }
}
```

Keys correspond to CSS var names without the leading `--`.

## Testing

Snapshot tests assert the generated CSS is stable. This package avoids any non-CSS source of truth for theme values.
