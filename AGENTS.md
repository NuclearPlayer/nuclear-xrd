# AGENTS.md

Guidelines for AI coding agents working on Nuclear Music Player.

## Project Overview

Nuclear is a music player desktop app built with Tauri (Rust + React). This is a pnpm monorepo managed with Turborepo.

### Packages

- `@nuclearplayer/player` - Main Tauri app (React + Rust)
- `@nuclearplayer/ui` - Shared UI components
- `@nuclearplayer/plugin-sdk` - Plugin system
- `@nuclearplayer/model` - Data model
- `@nuclearplayer/themes` - Theming system
- `@nuclearplayer/hifi` - Advanced HTML5 audio component
- `@nuclearplayer/tailwind-config` - Shared Tailwind config
- `@nuclearplayer/eslint-config` - Shared linting rules
- `@nuclearplayer/i18n` - Internationalization
- `@nuclearplayer/storybook` - Component demos
- `@nuclearplayer/docs` - Documentation
- `@nuclearplayer/website` - Project website (Astro, separate from React ecosystem)

## Build/Lint/Test Commands

```bash
# Development
pnpm dev                    # Run player in dev mode
pnpm storybook              # Run Storybook

# Build
pnpm build                  # Build all packages
pnpm tauri build            # Build Tauri app

# Linting & Type Checking
pnpm lint                   # Lint all packages
pnpm lint:fix               # Lint and auto-fix
pnpm type-check             # TypeScript checks across packages

# Testing
pnpm test                   # Run all tests
pnpm test:coverage          # Run tests with coverage

# Run a single test file (from package directory)
pnpm --filter @nuclearplayer/ui test -- src/components/Badge/Badge.test.tsx
pnpm --filter @nuclearplayer/player test -- src/stores/queueStore.test.ts

# Run tests matching a pattern
pnpm --filter @nuclearplayer/ui test -- --testNamePattern="renders"

# Watch mode for a specific package
pnpm --filter @nuclearplayer/ui test:watch

# Utilities
pnpm clean                  # Clean build artifacts
```

## Code Style Guidelines

### General Principles

- Prioritize readability over cleverness
- No comments in code - explain reasoning in chat/commits instead
- Avoid premature abstractions - start concrete, extract later
- Look for dead code and opportunities to simplify
- Small, focused changes over large dumps

### TypeScript

- Use `type` not `interface` (except when merging is required)
- No magic numbers - extract into named constants
- Strict mode enabled with `noUnusedLocals` and `noUnusedParameters`
- Target ES2022 with bundler module resolution

### React Components

Use this pattern for components:

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
}) => {
  return (
    <div className={cn(componentVariants({ variant, className }))} {...props} />
  );
};
```

- Use `const Component: FC<Props>` not `function Component()`
- Prefer compound components (`Component.Sub`) for complex widgets
- Keep business logic out of UI components - they should be presentation-only

### Import Order (auto-sorted by Prettier)

1. Built-in modules
2. Third-party modules
3. `@nuclearplayer/*` packages
4. Relative imports (`.` then `..`)

### Styling with Tailwind v4

- CSS-first configuration - see `packages/tailwind-config/global.css`
- Use theme colors: `bg-background`, `text-foreground`, `bg-primary`, etc.
- Accent colors: `accent-green`, `accent-yellow`, `accent-purple`, `accent-blue`, `accent-orange`, `accent-cyan`, `accent-red`
- Use `font-sans` and `font-heading` utilities for typography
- Use `cn()` utility for conditional class merging
- Use `cva()` from class-variance-authority for component variants

### State Management

- **Zustand** - persistent UI state
- **React state** - local, temporary state
- **TanStack Query v5** - HTTP requests/server state
- **TanStack Router** - client-side routing

### Error Handling

- Throw descriptive errors with context
- Validate inputs at boundaries
- Lift performance-critical logic to Rust (Tauri)

### External API Clients

External HTTP APIs live in `packages/player/src/apis/`. Use the `ApiClient` base class which handles fetch→json→Zod parse.

- Always validate external data with Zod schemas
- Export a singleton instance
- Keep API clients focused - one class per external service

### Internationalization (i18n)

All user-facing strings must go through the i18n system - no hardcoded strings in UI code.

**Translation files:** `packages/i18n/src/locales/{locale}.json` (e.g., `en_US.json`)

**Using translations in components:**

```tsx
import { useTranslation } from '@nuclearplayer/i18n';

export const MyComponent: FC = () => {
  const { t } = useTranslation();
  return <span>{t('navigation.settings')}</span>;
};
```

**Adding new strings:**

1. Add the key to `packages/i18n/src/locales/en_US.json` only
2. Use nested keys matching the feature area: `"feature.subfeature.key": "Value"`
3. Other locales are translated by contributors on Crowdin and merged automatically

## Testing Guidelines

Tests use Vitest + React Testing Library.

### Running Tests

```bash
# Run all tests in a package
pnpm --filter @nuclearplayer/ui test

# Run specific test file
pnpm --filter @nuclearplayer/ui test -- src/components/Badge/Badge.test.tsx

# Run tests matching pattern
pnpm --filter @nuclearplayer/player test -- --testNamePattern="queue"

# Update snapshots (run at root for all, or filter to a specific package)

# At root
pnpm test -- -u

# Filtering for a specific package
pnpm --filter @nuclearplayer/ui test -- -u

# After cd'ing into a package
pnpm test -u
```

### Test Patterns

- Test user behavior, not implementation details
- Minimize mocks - only mock external dependencies (HTTP, FS, Tauri)
- Snapshot tests: basic rendering only, prefix with `(Snapshot)`
- Extract DOM querying into helpers; keep assertions in tests

```tsx
import { render } from '@testing-library/react';

import { Component } from '.';

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

### Test Setup

Tests have `vitest.globals` enabled - `describe`, `it`, `expect`, `vi` are available without imports. Framer Motion animations are disabled in tests.

## Design Philosophy

- **Neo-brutalist with premium polish** - bold borders, purposeful shadows
- Use `framer-motion` and `tw-animate-css` for animations
- Disable animations during high-friction moments (resize, drag)
- Feel: professional yet approachable, Discord-like
- Avoid generic AI patterns. Icon-grid feature cards, stock hero images, "Built with love" badges, and other templated designs scream "AI-generated." Be intentional about design choices.

## File Organization

Components live in their own directories:

```
packages/ui/src/components/Badge/
  Badge.tsx           # Component implementation
  Badge.test.tsx      # Tests
  index.ts            # Re-exports
  __snapshots__/      # Vitest snapshots
```

## Tooling Notes

- **pnpm** - package manager (use workspace protocol for internal deps)
- **Turborepo** - task orchestration and caching
- **ESLint + Prettier** - linting and formatting (run together)
- **Husky + lint-staged** - pre-commit hooks

Always use centralized configs from the eslint-config and tailwind-config packages.

Assume I will regenerate tanstack router routes myself when I run the app to test. Do not regenerate them manually.

## Writing Plugins

Plugins are standalone repos that extend Nuclear. They're compiled in-browser via esbuild-wasm - no build step needed.

### Plugin Structure

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
    "@nuclearplayer/plugin-sdk": "^0.0.14"
  }
}
```

Categories: `streaming`, `metadata`, `lyrics`

### Plugin Entry Point

```typescript
import type { NuclearPlugin, NuclearPluginAPI } from '@nuclearplayer/plugin-sdk';

const plugin: NuclearPlugin = {
  onLoad(api: NuclearPluginAPI) {},
  onEnable(api: NuclearPluginAPI) {
    // Register providers here
  },
  onDisable() {
    // Unregister providers here
  },
  onUnload() {},
};

export default plugin;
```

### Provider Types

**Streaming** - resolve tracks to playable audio:

```typescript
import type { StreamingProvider, StreamCandidate, Stream } from '@nuclearplayer/plugin-sdk';

const provider: StreamingProvider = {
  id: 'my-streaming',
  kind: 'streaming',
  name: 'My Streaming',
  async searchForTrack(artist, title, album?): Promise<StreamCandidate[]> {
    // Return candidates sorted by preference
  },
  async getStreamUrl(candidateId): Promise<Stream> {
    // Resolve candidate to playable URL
  },
};

// In onEnable:
api.Providers.register(provider);

// In onDisable:
api.Providers.unregister('my-streaming');
```

**Metadata** - search artists/albums, fetch details:

```typescript
import type { MetadataProvider } from '@nuclearplayer/plugin-sdk';

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

### Available APIs

Access via `api` parameter in lifecycle hooks:

- `api.Providers` - register/unregister providers
- `api.Settings` - plugin settings storage
- `api.Http` - fetch wrapper for HTTP requests
- `api.Ytdlp` - yt-dlp integration (search YouTube, get stream URLs)
- `api.Queue` - playback queue control
- `api.Metadata` - search music metadata
- `api.Streaming` - resolve streams

### Publishing

1. Create GitHub repo with the plugin code
2. Add release workflow (`.github/workflows/release.yml`):

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

3. Tag a release: `git tag v0.1.0 && git push --tags`
4. Submit PR to `NuclearPlayer/plugin-registry` adding your plugin to `plugins.json`
