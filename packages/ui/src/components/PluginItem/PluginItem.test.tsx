import { render } from '@testing-library/react';
import { Music } from 'lucide-react';

import { PluginItem } from './PluginItem';

describe('PluginItem', () => {
  it('(Snapshot) renders with all props', () => {
    const { asFragment } = render(
      <PluginItem
        name="YouTube Music"
        author="Nuclear Team"
        description="Stream music directly from YouTube Music with full search and playlist support."
        icon={<Music size={24} />}
        onViewDetails={() => {}}
      />,
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
