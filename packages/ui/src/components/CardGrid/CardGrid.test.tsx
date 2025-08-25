import { render } from '@testing-library/react';

import { CardGrid } from '.';
import { Card } from '..';

describe('Card grid', () => {
  it('(Snapshot) Renders correctly', () => {
    const { container } = render(
      <CardGrid>
        <Card
          src="https://picsum.photos/300"
          title="Test album"
          subtitle="Test artist"
        />
      </CardGrid>,
    );
    expect(container).toMatchSnapshot();
  });
});
