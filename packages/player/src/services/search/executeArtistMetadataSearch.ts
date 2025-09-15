import { AlbumRef, Artist } from '@nuclearplayer/model';
import {
  MetadataProvider,
  MissingCapabilityError,
} from '@nuclearplayer/plugin-sdk';

export const executeArtistDetailsSearch = async (
  provider: MetadataProvider,
  artistId: string,
): Promise<Artist> => {
  if (!provider.artistMetadataCapabilities?.includes('artistDetails')) {
    throw new MissingCapabilityError('artistDetails');
  }

  return provider.fetchArtistDetails!(artistId)!;
};

export const executeArtistAlbumsSearch = async (
  provider: MetadataProvider,
  artistId: string,
): Promise<AlbumRef[]> => {
  if (!provider.artistMetadataCapabilities?.includes('artistAlbums')) {
    throw new MissingCapabilityError('artistAlbums');
  }

  return provider.fetchArtistAlbums!(artistId)!;
};
