import { Album } from '@nuclearplayer/model';
import {
  MetadataProvider,
  MissingCapabilityError,
} from '@nuclearplayer/plugin-sdk';

export const executeAlbumDetailsSearch = async (
  provider: MetadataProvider,
  albumId: string,
): Promise<Album> => {
  if (!provider.albumMetadataCapabilities?.includes('albumDetails')) {
    throw new MissingCapabilityError('albumDetails');
  }

  return provider.fetchAlbumDetails!(albumId)!;
};
