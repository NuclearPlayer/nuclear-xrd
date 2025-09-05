import { render } from '@testing-library/react';
import { Music } from 'lucide-react';

import { PluginItem } from './PluginItem';

describe('PluginItem', () => {
  it('(Snapshot) renders with all props', () => {
    const { asFragment } = render(
      <PluginItem
        className="border-accent-red"
        name="YouTube Music"
        author="Nuclear Team"
        description="Stream music directly from YouTube Music with full search and playlist support."
        icon={<Music size={24} />}
        onViewDetails={() => {}}
        loadTimeMs={200}
        warning
        warningText="Loaded with errors"
      />,
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it('(Snapshot) renders disabled state', () => {
    const { asFragment } = render(
      <PluginItem
        name="Disabled Plugin"
        author="Nuclear Team"
        description="This plugin is currently disabled."
        icon={<Music size={24} />}
        disabled
      />,
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it('(Snapshot) renders rightAccessory content', () => {
    const { asFragment } = render(
      <PluginItem
        name="Accessory Plugin"
        author="Nuclear Team"
        description="Has accessory on the right."
        rightAccessory={<span>Accessory</span>}
      />,
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
