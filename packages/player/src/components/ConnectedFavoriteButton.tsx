import { FC } from 'react';

import type { AlbumRef, ArtistRef, ProviderRef } from '@nuclearplayer/model';
import { FavoriteButton } from '@nuclearplayer/ui';

import { useFavoritesStore } from '../stores/favoritesStore';

type ConnectedFavoriteButtonProps = {
  className?: string;
  'data-testid'?: string;
} & (
  | { type: 'album'; source: ProviderRef; data: Omit<AlbumRef, 'source'> }
  | { type: 'artist'; source: ProviderRef; data: Omit<ArtistRef, 'source'> }
);

export const ConnectedFavoriteButton: FC<ConnectedFavoriteButtonProps> = (
  props,
) => {
  const {
    isAlbumFavorite,
    isArtistFavorite,
    addAlbum,
    addArtist,
    removeAlbum,
    removeArtist,
  } = useFavoritesStore();

  const { type, source, data, className, 'data-testid': testId } = props;

  const isFavorite =
    type === 'album' ? isAlbumFavorite(source) : isArtistFavorite(source);

  const handleToggle = () => {
    if (type === 'album') {
      if (isFavorite) {
        removeAlbum(source);
      } else {
        addAlbum({ ...data, source } as AlbumRef);
      }
    } else {
      if (isFavorite) {
        removeArtist(source);
      } else {
        addArtist({ ...data, source } as ArtistRef);
      }
    }
  };

  return (
    <FavoriteButton
      isFavorite={isFavorite}
      onToggle={handleToggle}
      className={className}
      data-testid={testId}
    />
  );
};
