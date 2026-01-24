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

# Update snapshots (cd to package directory first, or run at root for all)
pnpm test -- -u
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
