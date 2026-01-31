import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { FavoriteButton } from '.';

const defaultProps = {
  onToggle: () => {},
  ariaLabelAdd: 'Add to favorites',
  ariaLabelRemove: 'Remove from favorites',
};

describe('FavoriteButton', () => {
  it('(Snapshot) renders unfavorited state', () => {
    const { container } = render(
      <FavoriteButton {...defaultProps} isFavorite={false} />,
    );
    expect(container).toMatchSnapshot();
  });

  it('(Snapshot) renders favorited state', () => {
    const { container } = render(
      <FavoriteButton {...defaultProps} isFavorite={true} />,
    );
    expect(container).toMatchSnapshot();
  });

  it('calls onToggle when clicked', async () => {
    const user = userEvent.setup();
    const onToggle = vi.fn();
    const { getByRole } = render(
      <FavoriteButton
        {...defaultProps}
        isFavorite={false}
        onToggle={onToggle}
      />,
    );

    await user.click(getByRole('button'));
    expect(onToggle).toHaveBeenCalledTimes(1);
  });
});
