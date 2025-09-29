import { AlbumRef, Artist, ArtistRef, TrackRef } from '@nuclearplayer/model';
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

export const executeArtistTopTracksSearch = async (
  provider: MetadataProvider,
  artistId: string,
): Promise<TrackRef[]> => {
  if (!provider.artistMetadataCapabilities?.includes('artistTopTracks')) {
    throw new MissingCapabilityError('artistTopTracks');
  }

  return provider.fetchArtistTopTracks!(artistId)!;
};

export const executeArtistRelatedArtistsSearch = async (
  provider: MetadataProvider,
  artistId: string,
): Promise<ArtistRef[]> => {
  if (!provider.artistMetadataCapabilities?.includes('artistRelatedArtists')) {
    throw new MissingCapabilityError('artistRelatedArtists');
  }

  return provider.fetchArtistRelatedArtists!(artistId)!;
};
