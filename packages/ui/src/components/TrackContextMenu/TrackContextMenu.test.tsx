import { screen } from '@testing-library/react';

import { TrackContextMenuWrapper as Wrapper } from './TrackContextMenu.test-wrapper';

describe('TrackContextMenu', () => {
  it('(Snapshot) renders with header and actions', async () => {
    Wrapper.mount({
      title: 'Echoes',
      subtitle: 'Pink Floyd',
      coverUrl: 'https://example.com/meddle.jpg',
    });
    await Wrapper.open();
    await screen.findByText('Echoes');
    expect(document.body).toMatchSnapshot();
  });

  it('(Snapshot) renders header without cover image', async () => {
    Wrapper.mount({
      title: 'Paranoid Android',
      subtitle: 'Radiohead',
      actions: [{ label: 'Play Now', onClick: () => {} }],
    });
    await Wrapper.open();
    await screen.findByText('Paranoid Android');
    expect(document.body).toMatchSnapshot();
  });

  it('(Snapshot) renders header without subtitle', async () => {
    Wrapper.mount({
      title: 'Bohemian Rhapsody',
      coverUrl: 'https://example.com/night-at-the-opera.jpg',
      actions: [{ label: 'Play Now', onClick: () => {} }],
    });
    await Wrapper.open();
    await screen.findByText('Bohemian Rhapsody');
    expect(document.body).toMatchSnapshot();
  });

  it('calls action onClick when action is clicked', async () => {
    const onPlay = vi.fn();
    const onAddToQueue = vi.fn();

    Wrapper.mount({
      title: 'Stairway to Heaven',
      subtitle: 'Led Zeppelin',
      actions: [
        { label: 'Play Now', onClick: onPlay },
        { label: 'Add to Queue', onClick: onAddToQueue },
      ],
    });

    await Wrapper.open();
    await screen.findByText('Play Now');
    await Wrapper.action('Play Now').click();

    expect(onPlay).toHaveBeenCalledTimes(1);
    expect(onAddToQueue).not.toHaveBeenCalled();
  });

  it('stops propagation on trigger click', async () => {
    const onParentClick = vi.fn();

    Wrapper.mount({
      title: 'Come Together',
      subtitle: 'The Beatles',
      actions: [{ label: 'Play Now', onClick: () => {} }],
      onParentClick,
    });

    await Wrapper.open();

    expect(onParentClick).not.toHaveBeenCalled();
  });

  describe('Submenu', () => {
    const playlists = [
      { id: 'p1', name: 'Rock Classics' },
      { id: 'p2', name: 'Chill Vibes' },
    ];

    const manyPlaylists = Array.from({ length: 7 }, (_, i) => ({
      id: `p${i}`,
      name: `Playlist ${i}`,
    }));

    const mountWithSubmenu = (onSelect = vi.fn(), playlistList = playlists) => {
      Wrapper.mount({
        title: 'Test Track',
        subtitle: 'Artist',
        submenu: {
          label: 'Add to playlist',
          playlists: playlistList,
          onSelect,
          filterPlaceholder: 'Filter playlists...',
        },
      });
      return { onSelect };
    };

    it('renders the submenu trigger when menu is open', async () => {
      mountWithSubmenu();

      await Wrapper.open();
      expect(Wrapper.submenu.trigger).toHaveTextContent('Add to playlist');
    });

    it('shows playlist options when submenu trigger is clicked', async () => {
      mountWithSubmenu();

      await Wrapper.open();
      await Wrapper.submenu.open();

      expect(Wrapper.submenu.panel).toBeInTheDocument();
      expect(Wrapper.submenu.item('Rock Classics').element).toBeInTheDocument();
      expect(Wrapper.submenu.item('Chill Vibes').element).toBeInTheDocument();
    });

    it('calls onSelect with the playlist ID when a playlist is clicked', async () => {
      const { onSelect } = mountWithSubmenu();

      await Wrapper.open();
      await Wrapper.submenu.open();
      await Wrapper.submenu.item('Rock Classics').click();

      expect(onSelect).toHaveBeenCalledWith('p1');
    });

    it('shows filter input when there are more than 5 playlists', async () => {
      mountWithSubmenu(vi.fn(), manyPlaylists);

      await Wrapper.open();
      await Wrapper.submenu.open();

      expect(Wrapper.submenu.filterInput).toBeInTheDocument();
    });

    it('filters playlists by name', async () => {
      mountWithSubmenu(vi.fn(), manyPlaylists);

      await Wrapper.open();
      await Wrapper.submenu.open();
      await Wrapper.submenu.filter('3');

      expect(Wrapper.submenu.items).toHaveLength(1);
      expect(Wrapper.submenu.items[0]).toHaveTextContent('Playlist 3');
    });

    it('does not show filter input when there are 5 or fewer playlists', async () => {
      mountWithSubmenu();

      await Wrapper.open();
      await Wrapper.submenu.open();

      expect(Wrapper.submenu.filterInput).not.toBeInTheDocument();
    });
  });
});
