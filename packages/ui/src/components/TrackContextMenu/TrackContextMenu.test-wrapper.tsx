import { render, RenderResult, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { TrackContextMenu } from '.';

const user = userEvent.setup();

type SubmenuItem = {
  label: string;
  onClick: () => void;
};

type MountOptions = {
  title: string;
  subtitle?: string;
  coverUrl?: string;
  actions?: { label: string; onClick: () => void }[];
  submenu?: {
    label: string;
    items: SubmenuItem[];
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
            <TrackContextMenu.Submenu>
              <TrackContextMenu.SubmenuTrigger icon={<span>+</span>}>
                {submenu.label}
              </TrackContextMenu.SubmenuTrigger>
              <TrackContextMenu.SubmenuContent>
                {submenu.items.map(({ label, onClick }) => (
                  <TrackContextMenu.Action key={label} onClick={onClick}>
                    {label}
                  </TrackContextMenu.Action>
                ))}
              </TrackContextMenu.SubmenuContent>
            </TrackContextMenu.Submenu>
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
      return screen.queryByTestId('submenu-content');
    },
    item(name: string) {
      return {
        get element() {
          return screen.getByText(name);
        },
        async click() {
          return userEvent.click(this.element);
        },
      };
    },
  },
};
