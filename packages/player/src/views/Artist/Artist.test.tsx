import { providersServiceHost } from '../../services/providersService';
import { MetadataProviderBuilder } from '../../test/builders/MetadataProviderBuilder';
import { ArtistWrapper } from './Artist.test-wrapper';

describe('Artist view', () => {
  beforeEach(() => {
    providersServiceHost.clear();
    providersServiceHost.register(
      new MetadataProviderBuilder()
        .withSearchCapabilities(['unified', 'artists'])
        .withSearch(async () => ({
          artists: [
            {
              name: 'Test Artist',
              source: {
                provider: 'test-metadata-provider',
                id: 'test-artist-id',
              },
            },
          ],
        }))
        .build(),
    );
  });

  it('(Snapshot) renders the artist view', async () => {
    const component = await ArtistWrapper.mount();
    expect(component).toMatchSnapshot();
  });
});
