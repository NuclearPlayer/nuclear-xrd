import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { FavoriteButton } from '.';

describe('FavoriteButton', () => {
  it('(Snapshot) renders unfavorited state', () => {
    const { container } = render(
      <FavoriteButton isFavorite={false} onToggle={() => {}} />,
    );
    expect(container).toMatchSnapshot();
  });

  it('(Snapshot) renders favorited state', () => {
    const { container } = render(
      <FavoriteButton isFavorite={true} onToggle={() => {}} />,
    );
    expect(container).toMatchSnapshot();
  });

  it('calls onToggle when clicked', async () => {
    const user = userEvent.setup();
    const onToggle = vi.fn();
    const { getByRole } = render(
      <FavoriteButton isFavorite={false} onToggle={onToggle} />,
    );

    await user.click(getByRole('button'));
    expect(onToggle).toHaveBeenCalledTimes(1);
  });
});
