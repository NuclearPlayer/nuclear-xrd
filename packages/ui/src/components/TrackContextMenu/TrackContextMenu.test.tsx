import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ReactNode } from 'react';

import { TrackContextMenu } from '.';

type ActionConfig = {
  label: string;
  onClick: () => void;
};

type RenderMenuOptions = {
  title: string;
  subtitle?: string;
  coverUrl?: string;
  actions?: ActionConfig[];
  triggerLabel?: string;
};

const defaultActions: ActionConfig[] = [
  { label: 'Play Now', onClick: () => {} },
  { label: 'Add to Queue', onClick: () => {} },
];

const renderMenu = (options: RenderMenuOptions, wrapper?: ReactNode) => {
  const {
    title,
    subtitle,
    coverUrl,
    actions = defaultActions,
    triggerLabel = 'Open',
  } = options;

  const menu = (
    <TrackContextMenu>
      <TrackContextMenu.Trigger>
        <button>{triggerLabel}</button>
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
      </TrackContextMenu.Content>
    </TrackContextMenu>
  );

  return render(wrapper ? <div onClick={() => {}}>{menu}</div> : menu);
};

const openMenu = async (triggerLabel = 'Open') => {
  await userEvent.click(screen.getByText(triggerLabel));
};

describe('TrackContextMenu', () => {
  it('(Snapshot) renders with header and actions', async () => {
    renderMenu({
      title: 'Echoes',
      subtitle: 'Pink Floyd',
      coverUrl: 'https://example.com/meddle.jpg',
    });
    await openMenu();
    await screen.findByText('Echoes');
    expect(document.body).toMatchSnapshot();
  });

  it('(Snapshot) renders header without cover image', async () => {
    renderMenu({
      title: 'Paranoid Android',
      subtitle: 'Radiohead',
      actions: [{ label: 'Play Now', onClick: () => {} }],
    });
    await openMenu();
    await screen.findByText('Paranoid Android');
    expect(document.body).toMatchSnapshot();
  });

  it('(Snapshot) renders header without subtitle', async () => {
    renderMenu({
      title: 'Bohemian Rhapsody',
      coverUrl: 'https://example.com/night-at-the-opera.jpg',
      actions: [{ label: 'Play Now', onClick: () => {} }],
    });
    await openMenu();
    await screen.findByText('Bohemian Rhapsody');
    expect(document.body).toMatchSnapshot();
  });

  it('calls action onClick when action is clicked', async () => {
    const user = userEvent.setup();
    const onPlay = vi.fn();
    const onAddToQueue = vi.fn();

    renderMenu({
      title: 'Stairway to Heaven',
      subtitle: 'Led Zeppelin',
      actions: [
        { label: 'Play Now', onClick: onPlay },
        { label: 'Add to Queue', onClick: onAddToQueue },
      ],
    });

    await user.click(screen.getByText('Open'));
    await screen.findByText('Play Now');
    await user.click(screen.getByText('Play Now'));

    expect(onPlay).toHaveBeenCalledTimes(1);
    expect(onAddToQueue).not.toHaveBeenCalled();
  });

  it('stops propagation on trigger click', async () => {
    const user = userEvent.setup();
    const onParentClick = vi.fn();

    render(
      <div onClick={onParentClick}>
        <TrackContextMenu>
          <TrackContextMenu.Trigger>
            <button>Open Menu</button>
          </TrackContextMenu.Trigger>
          <TrackContextMenu.Content>
            <TrackContextMenu.Header
              title="Come Together"
              subtitle="The Beatles"
            />
            <TrackContextMenu.Action icon={<span>•</span>} onClick={() => {}}>
              Play Now
            </TrackContextMenu.Action>
          </TrackContextMenu.Content>
        </TrackContextMenu>
      </div>,
    );

    await user.click(screen.getByText('Open Menu'));

    expect(onParentClick).not.toHaveBeenCalled();
  });
});
