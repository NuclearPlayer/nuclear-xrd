---
name: creating-components
description: Use when creating new UI components in packages/ui. Covers component structure, tests, stories, and what to avoid.
---

# Creating UI Components

## Component Structure

```
packages/ui/src/components/MyComponent/
├── MyComponent.tsx      # Implementation
├── MyComponent.test.tsx # Tests
├── index.ts             # Re-exports
└── __snapshots__/       # Vitest snapshots (auto-generated)
```

After creating, export from `packages/ui/src/components/index.ts`.

## Implementation Pattern

```tsx
import { cva, VariantProps } from 'class-variance-authority';
import { ComponentProps, FC } from 'react';
import { cn } from '../../utils';

const variants = cva('base-classes', {
  variants: { /* ... */ },
  defaultVariants: { /* ... */ },
});

type MyComponentProps = ComponentProps<'div'> & VariantProps<typeof variants>;

export const MyComponent: FC<MyComponentProps> = ({
  className,
  variant,
  ...props
}) => (
  <div className={cn(variants({ variant, className }))} {...props} />
);
```

## Tests

**What to test:**
- Snapshots (1-2 covering key variants)
- User interactions
- Behavior (callbacks called with correct args)

**What NOT to test:**
- CSS classes, attributes (use snapshots instead)
- Internal state
- Things TypeScript already enforces

**Consolidate tests.** One test can cover multiple related assertions. An exception to that is snapshot tests - one snapshot per variant/state.

## Stories

Create `packages/storybook/src/MyComponent.stories.tsx`.

**One story can show multiple related variants.** For example, it's wasteful to create a story for each variant of a button. Put them all together in one place. Don't create separate stories for each variant:

```tsx
import { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { MyComponent } from '@nuclearplayer/ui';

const meta = {
  title: 'Components/MyComponent',
  component: MyComponent,
  tags: ['autodocs'],
} satisfies Meta<typeof MyComponent>;

export default meta;
type Story = StoryObj<typeof MyComponent>;

export const AllVariants: Story = {
  render: () => {
    const [state, setState] = useState(initialState);
    return (
      <div className="flex flex-col gap-4">
        {/* Show all variants, states, interactions */}
      </div>
    );
  },
};
```

This isn't an iron rule, sometimes it will make more sense to have separate stories.

Don't run storybook build checks.

## Avoiding Duplication

Before creating a new component, check if an existing one can be extended.

**Pattern: Discriminated unions for mode variants**

Example: Instead of creating `SingleSelect` and `MultiSelect` components:

```tsx
type Props = 
  | { multiple?: false; selected: string; onChange: (id: string) => void }
  | { multiple: true; selected: string[]; onChange: (ids: string[]) => void };
```

TypeScript enforces correct types based on the `multiple` prop.

## Classes for customization

Where it's likely that a component will need custom styling, expose a `className` prop.

If there are many parts that may need styling, consider exposing a `classes` prop with specific class names for each part. Define a type for the `classes` prop. Refer to `packages/ui/src/components/TrackTable/types.ts` for an example.

## Strings

All user-facing strings go through i18n - no hardcoded UI text.
If a new component in the ui package needs labels and other kinds of localized text, it should accept a `labels` prop with the relevant strings. The prop should have its own type defined. Refer to `packages/ui/src/components/QueueItem/types.ts` for an example.

## Accessibility

We don't care about that. If there's an opportunity to handle that easily, do it, but don't go out of your way.

## Checklist

- [ ] Component in `packages/ui/src/components/MyComponent/`
- [ ] Exported from `packages/ui/src/components/index.ts`
- [ ] Tests cover behavior, not implementation
- [ ] Tests consolidated (not one per variant)
- [ ] One story showing all variants
- [ ] No CSS class assertions in tests
- [ ] No duplicate component when extending existing one works
