import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import '@nuclearplayer/tailwind-config';

import { Select } from '.';

const OPTIONS = [
  { id: 'low', label: 'Low' },
  { id: 'medium', label: 'Medium' },
  { id: 'high', label: 'High' },
];

describe('Select', () => {
  it('(Snapshot) renders basic with description', () => {
    const { container } = render(
      <Select
        id="select-quality"
        label="Quality"
        options={OPTIONS}
        defaultValue="medium"
        description="Choose your preferred playback quality."
      />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('(Snapshot) renders error without description', () => {
    const { container } = render(
      <Select
        id="select-quality-error"
        label="Quality"
        options={OPTIONS}
        error="Please make a selection"
      />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('runs onValueChange callback on selection', async () => {
    const onValueChange = vi.fn();
    render(<Select options={OPTIONS} onValueChange={onValueChange} />);
    await userEvent.click(await screen.findByRole('button'));
    await userEvent.click(await screen.findByRole('option', { name: 'High' }));
    expect(onValueChange).toHaveBeenCalledWith('high');
  });
});
