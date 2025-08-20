import { describe, expect, it } from 'vitest';

import { AdvancedThemeSchema } from '../../advanced/schema';

describe('AdvancedThemeSchema', () => {
  it('accepts minimal valid theme', () => {
    const t = AdvancedThemeSchema.parse({ version: 1, name: 'Ok' });
    expect(t).toEqual({ version: 1, name: 'Ok' });
  });

  it('rejects keys starting with --', () => {
    expect(() =>
      AdvancedThemeSchema.parse({
        version: 1,
        name: 'Bad',
        vars: { '--background': 'oklch(...)' },
      }),
    ).toThrowError();
  });
});
