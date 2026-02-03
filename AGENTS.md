# AGENTS.md

Guidelines for AI coding agents working on Nuclear Music Player.

## Project Overview

Nuclear is a music player desktop app built with Tauri (Rust + React). This is a pnpm monorepo managed with Turborepo.

### Packages

- `@nuclearplayer/player` - Main Tauri app (React + Rust)
- `@nuclearplayer/ui` - Shared UI components
- `@nuclearplayer/plugin-sdk` - Plugin system (published to npm)
- `@nuclearplayer/model` - Data model
- `@nuclearplayer/themes` - Theming system
- `@nuclearplayer/hifi` - Advanced HTML5 audio component
- `@nuclearplayer/tailwind-config` - Shared Tailwind config
- `@nuclearplayer/eslint-config` - Shared linting rules
- `@nuclearplayer/i18n` - Internationalization
- `@nuclearplayer/storybook` - Component demos
- `@nuclearplayer/docs` - Documentation
- `@nuclearplayer/website` - Project website (Astro)

## Commands

```bash
# Development
pnpm dev                    # Run player in dev mode
pnpm storybook              # Run Storybook

# Build
pnpm build                  # Build all packages
pnpm tauri build            # Build Tauri app

# Quality
pnpm lint                   # Lint all packages
pnpm lint:fix               # Lint and auto-fix
pnpm type-check             # TypeScript checks
pnpm test                   # Run all tests
pnpm test:coverage          # Run tests with coverage
pnpm clean                  # Clean build artifacts

# Package-specific testing
pnpm --filter @nuclearplayer/ui test -- src/components/Badge/Badge.test.tsx
pnpm --filter @nuclearplayer/ui test -- --testNamePattern="renders"

# Update snapshots (run at root for all, or filter to a specific package)

# At root
pnpm test -- -u

# Filtering for a specific package
pnpm --filter @nuclearplayer/ui test -- -u

# After cd'ing into a package
pnpm test -u
```

## Code Style

### General Principles

- Prioritize readability over cleverness
- No comments in code - explain reasoning in chat/commits
- Avoid premature abstractions - start concrete, extract later
- Small, focused changes over large dumps
- Never commit unless explicitly asked

### TypeScript

- Use `type` not `interface` (except when merging is required)
- No magic numbers - extract into named constants
- Strict mode with `noUnusedLocals` and `noUnusedParameters`

### React Components

```tsx
import { cva, VariantProps } from 'class-variance-authority';
import { ComponentProps, FC } from 'react';

import { cn } from '../../utils';

const componentVariants = cva('base-classes', {
  variants: { /* ... */ },
  defaultVariants: { /* ... */ },
});

type ComponentProps = ComponentProps<'div'> &
  VariantProps<typeof componentVariants>;

export const Component: FC<ComponentProps> = ({
  className,
  variant,
  ...props
}) => (
  <div className={cn(componentVariants({ variant, className }))} {...props} />
);
```

- Use `const Component: FC<Props>` not `function Component()`
- Compound components (`Component.Sub`) for complex widgets
- Keep business logic out of UI components

### Adding UI Components

When adding a new component to `@nuclearplayer/ui`:

1. Create component directory: `packages/ui/src/components/MyComponent/`
   - `MyComponent.tsx` - implementation
   - `MyComponent.test.tsx` - tests (aim for 100% coverage)
   - `index.ts` - re-exports
2. Export from `packages/ui/src/components/index.ts`
3. Add Storybook story in `packages/storybook/src/MyComponent.stories.tsx`
4. Include snapshot test(s) covering all variants

### Styling (Tailwind v4)

- CSS-first config in `packages/tailwind-config/global.css`
- Theme colors: `bg-background`, `text-foreground`, `bg-primary`
- Accents: `accent-green`, `accent-yellow`, `accent-purple`, `accent-blue`, `accent-orange`, `accent-cyan`, `accent-red`
- Use `cn()` for conditional classes, `cva()` for variants

### State Management

- **Zustand** - persistent UI state
- **React state** - local, temporary state
- **TanStack Query v5** - HTTP requests/server state
- **TanStack Router** - client-side routing

### Standardized Libraries

- **Icons**: Lucide React (not heroicons, not font-awesome)
- **Toasts**: Sonner
- **Dates**: Luxon
- **Utilities**: lodash-es (use individual imports: `import isEqual from 'lodash-es/isEqual'`)
- **HTTP**: Native fetch via ApiClient base class (no axios)

### Adding New Domains

A "domain" is a feature area exposed to plugins (e.g., settings, queue, favorites). When adding a new domain:

1. **Types** (`packages/plugin-sdk/src/types/myDomain.ts`)
   - Define the `MyDomainHost` interface (the contract between player and SDK)
   - Export any related types plugins will use

2. **API class** (`packages/plugin-sdk/src/api/myDomain.ts`)
   - Create a class that wraps the host and exposes methods to plugins
   - Add to `NuclearAPI` constructor in `packages/plugin-sdk/src/api/index.ts`

3. **Store** (`packages/player/src/stores/myDomainStore.ts`)
   - Zustand store holding the domain state
   - Persists to disk via `@tauri-apps/plugin-store` if needed

4. **Host** (`packages/player/src/services/myDomainHost.ts`)
   - Implements the `MyDomainHost` interface
   - Bridges the SDK API to the Zustand store
   - Passed to `NuclearAPI` when initializing plugins

### External API Clients

Live in `packages/player/src/apis/`. Use `ApiClient` base class (fetch→json→Zod).

- Validate external data with Zod schemas
- Export singleton instances
- One class per external service

### Internationalization

All user-facing strings go through i18n - no hardcoded UI text.

```tsx
import { useTranslation } from '@nuclearplayer/i18n';

const { t } = useTranslation();
<span>{t('navigation.settings')}</span>
```

Add new strings to `packages/i18n/src/locales/en_US.json` only. Other locales come from Crowdin.

## Testing

Tests use Vitest + React Testing Library. Globals enabled (`describe`, `it`, `expect`, `vi`).

- Test user behavior, not implementation details
- Minimize mocks - only mock external deps (HTTP, FS, Tauri)
- Snapshot tests: prefix with `(Snapshot)`, basic rendering only

```tsx
describe('Component', () => {
  it('(Snapshot) renders correctly', () => {
    const { container } = render(<Component />);
    expect(container).toMatchSnapshot();
  });

  it('handles user interaction', async () => {
    const user = userEvent.setup();
    const { getByRole } = render(<Component />);
    await user.click(getByRole('button'));
    expect(getByRole('status')).toHaveTextContent('clicked');
  });
});
```

## File Organization

```
packages/ui/src/components/Badge/
  Badge.tsx           # Implementation
  Badge.test.tsx      # Tests
  index.ts            # Re-exports
  __snapshots__/      # Vitest snapshots
```

## Design Philosophy

- Neo-brutalist with premium polish - bold borders, purposeful shadows
- Premium, designed feel
- Animations via `framer-motion` and `tw-animate-css`
- Disable animations during high-friction moments (resize, drag)
- Avoid generic AI patterns (icon-grid cards, stock heroes, "Built with love" badges)

## Tooling Notes

- **pnpm** with workspace protocol for internal deps
- **Turborepo** for task orchestration
- **ESLint + Prettier** run together
- **Husky + lint-staged** for pre-commit hooks

Use centralized configs from eslint-config and tailwind-config packages.

Assume TanStack Router routes regenerate on dev - don't regenerate manually.

## Releasing

### Nuclear Player

Releases are triggered by git tags. The workflow builds for macOS (arm64/x64), Linux, and Windows.

```bash
# 1. Update version in packages/player/package.json
# 2. Update version in packages/player/src-tauri/tauri.conf.json
# 3. Commit the version bump
git add -A && git commit -m "chore: bump player to X.Y.Z"

# 4. Tag and push
git tag player@X.Y.Z
git push origin main --tags
```

The `release-player.yml` workflow creates a GitHub release with platform binaries.

### Plugin SDK

Published to npm via the `release-plugin-sdk.yml` workflow.

```bash
# 1. Update version in packages/plugin-sdk/package.json
# 2. Commit the version bump
git add -A && git commit -m "chore: bump plugin-sdk to X.Y.Z"

# 3. Tag and push
git tag plugin-sdk@X.Y.Z
git push origin main --tags
```

The workflow builds with `build:npm`, runs tests, and publishes to npm.

## Writing Plugins

Plugins are standalone repos compiled in-browser via esbuild-wasm.

### Structure

```
my-plugin/
  package.json      # Manifest with nuclear metadata
  src/
    index.ts        # Entry point, default exports NuclearPlugin
```

### Manifest (package.json)

```json
{
  "name": "nuclear-plugin-example",
  "version": "0.1.0",
  "description": "What this plugin does",
  "author": "Your Name",
  "license": "AGPL-3.0-only",
  "main": "src/index.ts",
  "type": "module",
  "nuclear": {
    "displayName": "Example Plugin",
    "category": "streaming",
    "icon": { "type": "link", "link": "https://example.com/icon.svg" }
  },
  "dependencies": {
    "@nuclearplayer/plugin-sdk": "^1.1.0"
  }
}
```

Categories: `streaming`, `metadata`, `lyrics`

### Entry Point

```typescript
import type { NuclearPlugin, NuclearPluginAPI } from '@nuclearplayer/plugin-sdk';

const plugin: NuclearPlugin = {
  onLoad(api: NuclearPluginAPI) {},
  onEnable(api: NuclearPluginAPI) {
    // Register providers
  },
  onDisable() {
    // Unregister providers
  },
  onUnload() {},
};

export default plugin;
```

### Provider Types

**Streaming** - resolve tracks to playable audio:

```typescript
const provider: StreamingProvider = {
  id: 'my-streaming',
  kind: 'streaming',
  name: 'My Streaming',
  async searchForTrack(artist, title, album?) { /* return StreamCandidate[] */ },
  async getStreamUrl(candidateId) { /* return Stream */ },
};

api.Providers.register(provider);
api.Providers.unregister('my-streaming');
```

**Metadata** - search artists/albums, fetch details:

```typescript
const provider: MetadataProvider = {
  id: 'my-metadata',
  kind: 'metadata',
  name: 'My Metadata',
  searchCapabilities: ['artists', 'albums'],
  async searchArtists(params) { /* ... */ },
  async searchAlbums(params) { /* ... */ },
  async fetchArtistDetails(id) { /* ... */ },
  async fetchAlbumDetails(id) { /* ... */ },
};
```

### Available Plugin APIs

- `api.Providers` - register/unregister providers
- `api.Settings` - plugin settings storage
- `api.Http` - fetch wrapper
- `api.Ytdlp` - yt-dlp integration
- `api.Queue` - playback queue control
- `api.Metadata` - search music metadata
- `api.Streaming` - resolve streams

### Publishing Plugins

1. Create GitHub repo with plugin code
2. Add `.github/workflows/release.yml`:

```yaml
name: Release
on:
  push:
    tags: ['v*']
jobs:
  release:
    runs-on: ubuntu-latest
    permissions:
      contents: write
    steps:
      - uses: actions/checkout@v4
      - run: zip -r plugin.zip src package.json README.md
      - uses: softprops/action-gh-release@v2
        with:
          files: plugin.zip
          generate_release_notes: true
```

3. Tag release: `git tag v0.1.0 && git push --tags`
4. Submit PR to `NuclearPlayer/plugin-registry` adding your plugin to `plugins.json`
