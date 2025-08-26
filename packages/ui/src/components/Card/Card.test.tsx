import { render } from '@testing-library/react';

import { Card } from '.';

describe('Card', () => {
  it('(Snapshot) renders correctly', async () => {
    const { container } = render(
      <Card
        src="https://picsum.photos/300"
        title="Test album"
        subtitle="Test artist"
      />,
    );
    expect(container).toMatchSnapshot();
  });
});
