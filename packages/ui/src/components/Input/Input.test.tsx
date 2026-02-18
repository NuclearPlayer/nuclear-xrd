import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import '@nuclearplayer/tailwind-config';

import { Input } from '.';

describe('Input', () => {
  it('(Snapshot) renders text input with description', () => {
    const { container } = render(
      <Input
        id="input-username"
        label="Username"
        placeholder="your-username"
        description="This is your public display name."
      />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('(Snapshot) renders with error and no description', () => {
    const { container } = render(
      <Input
        id="input-username-error"
        label="Username"
        placeholder="your-username"
        error="Username is already taken"
      />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('(Snapshot) renders with endAddon', () => {
    const { container } = render(
      <Input
        id="input-with-addon"
        placeholder="Filter..."
        endAddon={<button type="button">X</button>}
      />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
