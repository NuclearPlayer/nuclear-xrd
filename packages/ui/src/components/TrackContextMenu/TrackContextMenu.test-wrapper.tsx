import { render, RenderResult, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { TrackContextMenu } from '.';

const user = userEvent.setup();

type PlaylistOption = {
  id: string;
  name: string;
};

type MountOptions = {
  title: string;
  subtitle?: string;
  coverUrl?: string;
  actions?: { label: string; onClick: () => void }[];
  submenu?: {
    label: string;
    playlists: PlaylistOption[];
    onSelect: () => void;
    filterPlaceholder?: string;
  };
  onParentClick?: () => void;
};

const defaultActions = [
  { label: 'Play Now', onClick: () => {} },
  { label: 'Add to Queue', onClick: () => {} },
];

export const TrackContextMenuWrapper = {
  mount(options: MountOptions): RenderResult {
    const {
      title,
      subtitle,
      coverUrl,
      actions = defaultActions,
      submenu,
      onParentClick,
    } = options;

    const menu = (
      <TrackContextMenu>
        <TrackContextMenu.Trigger>
          <button>Open</button>
        </TrackContextMenu.Trigger>
        <TrackContextMenu.Content>
          <TrackContextMenu.Header
            title={title}
            subtitle={subtitle}
            coverUrl={coverUrl}
          />
          {actions.map(({ label, onClick }) => (
            <TrackContextMenu.Action
              key={label}
              icon={<span>•</span>}
              onClick={onClick}
            >
              {label}
            </TrackContextMenu.Action>
          ))}
          {submenu && (
            <TrackContextMenu.Submenu
              label={submenu.label}
              icon={<span>+</span>}
              playlists={submenu.playlists}
              onSelect={submenu.onSelect}
              filterPlaceholder={submenu.filterPlaceholder}
            />
          )}
        </TrackContextMenu.Content>
      </TrackContextMenu>
    );

    return render(
      onParentClick ? <div onClick={onParentClick}>{menu}</div> : menu,
    );
  },

  async open() {
    await user.click(screen.getByText('Open'));
  },

  action(label: string) {
    return {
      get element() {
        return screen.getByText(label);
      },
      async click() {
        await user.click(this.element);
      },
    };
  },

  submenu: {
    get trigger() {
      return screen.queryByTestId('submenu-trigger');
    },
    async open() {
      await user.click(screen.getByTestId('submenu-trigger'));
    },
    get panel() {
      return screen.queryByTestId('playlist-submenu');
    },
    get items() {
      return screen.queryAllByTestId('playlist-submenu-item');
    },
    item(name: string) {
      return {
        get element() {
          return screen.getByText(name);
        },
        async click() {
          await user.click(this.element);
        },
      };
    },
    get filterInput() {
      return screen.queryByTestId('playlist-filter-input');
    },
    async filter(text: string) {
      await user.type(screen.getByTestId('playlist-filter-input'), text);
    },
  },
};
