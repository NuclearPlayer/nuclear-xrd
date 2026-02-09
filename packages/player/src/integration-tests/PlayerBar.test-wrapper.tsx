import { screen } from '@testing-library/react';

export const PlayerBarWrapper = {
  get isPlaying() {
    return screen.queryByTestId('player-pause-button') !== null;
  },
};
