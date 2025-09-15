import { MetadataProviderBuilder } from '../../test/builders/MetadataProviderBuilder';
import {
  executeArtistAlbumsSearch,
  executeArtistDetailsSearch,
} from './executeArtistMetadataSearch';

describe('executeDetailsSearch', () => {
  it('fetches artist details', async () => {
    const fetchArtistDetails = vi.fn();
    const provider = new MetadataProviderBuilder()
      .withFetchArtistDetails(fetchArtistDetails)
      .withArtistMetadataCapabilities(['artistDetails'])
      .build();
    await executeArtistDetailsSearch(provider, 'artist-id');

    expect(fetchArtistDetails).toHaveBeenCalledWith('artist-id');
  });

  it('fetches artist albums', async () => {
    const fetchArtistAlbums = vi.fn();
    const provider = new MetadataProviderBuilder()
      .withFetchArtistAlbums(fetchArtistAlbums)
      .withArtistMetadataCapabilities(['artistAlbums'])
      .build();
    await executeArtistAlbumsSearch(provider, 'artist-id');

    expect(fetchArtistAlbums).toHaveBeenCalledWith('artist-id');
  });

  it.each([
    { method: executeArtistDetailsSearch, capability: 'artistDetails' },
    { method: executeArtistAlbumsSearch, capability: 'artistAlbums' },
  ])('throws if capability missing', async ({ method, capability }) => {
    const provider = new MetadataProviderBuilder()
      .withSearchCapabilities([])
      .withArtistMetadataCapabilities([])
      .build();

    expect(method(provider, 'artist-id')).rejects.toThrowError(
      `Missing capability: ${capability}`,
    );
  });
});
