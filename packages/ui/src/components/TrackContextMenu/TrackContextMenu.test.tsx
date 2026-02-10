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
    const submenuItems = [
      { label: 'Option A', onClick: vi.fn() },
      { label: 'Option B', onClick: vi.fn() },
    ];

    const mountWithSubmenu = (items = submenuItems) => {
      Wrapper.mount({
        title: 'Test Track',
        subtitle: 'Artist',
        submenu: {
          label: 'More options',
          items,
        },
      });
    };

    it('renders the submenu trigger when menu is open', async () => {
      mountWithSubmenu();

      await Wrapper.open();
      expect(Wrapper.submenu.trigger).toHaveTextContent('More options');
    });

    it('shows submenu content when trigger is clicked', async () => {
      mountWithSubmenu();

      await Wrapper.open();
      await Wrapper.submenu.open();

      expect(Wrapper.submenu.panel).toBeInTheDocument();
      expect(Wrapper.submenu.item('Option A').element).toBeInTheDocument();
      expect(Wrapper.submenu.item('Option B').element).toBeInTheDocument();
    });

    it('calls onClick when a submenu item is clicked', async () => {
      const onClickA = vi.fn();
      const onClickB = vi.fn();
      mountWithSubmenu([
        { label: 'Option A', onClick: onClickA },
        { label: 'Option B', onClick: onClickB },
      ]);

      await Wrapper.open();
      await Wrapper.submenu.open();
      await Wrapper.submenu.item('Option A').click();

      expect(onClickA).toHaveBeenCalledTimes(1);
      expect(onClickB).not.toHaveBeenCalled();
    });
  });
});
