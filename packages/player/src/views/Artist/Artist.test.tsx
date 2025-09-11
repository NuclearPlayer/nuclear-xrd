import { MetadataProvider } from '@nuclearplayer/plugin-sdk';

import { providersServiceHost } from '../../services/providersService';
import { ArtistWrapper } from './Artist.test-wrapper';

describe('Artist view', () => {
  beforeEach(() => {
    providersServiceHost.clear();
    providersServiceHost.register({
      id: 'test-metadata-provider',
      kind: 'metadata',
      name: 'Test Metadata Provider',
      capabilities: ['unified', 'artists'],
      search: async () => {
        return {
          artists: [
            {
              name: 'Test Artist',
              source: {
                provider: 'test-metadata-provider',
                id: 'test-artist-id',
              },
            },
          ],
        };
      },
    } as MetadataProvider);
  });

  it('(Snapshot) renders the artist view', async () => {
    const component = await ArtistWrapper.mount();
    expect(component).toMatchSnapshot();
  });
});
