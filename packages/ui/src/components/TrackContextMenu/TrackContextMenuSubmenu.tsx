import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { ChevronRight } from 'lucide-react';
import { FC, ReactNode, useState } from 'react';

import { cn } from '../../utils';
import { Input } from '../Input';
import { ScrollableArea } from '../ScrollableArea';

type PlaylistOption = {
  id: string;
  name: string;
};

type TrackContextMenuSubmenuProps = {
  label: string;
  icon?: ReactNode;
  playlists: PlaylistOption[];
  onSelect: (playlistId: string) => void;
  filterPlaceholder?: string;
};

export const TrackContextMenuSubmenu: FC<TrackContextMenuSubmenuProps> = ({
  label,
  icon,
  playlists,
  onSelect,
  filterPlaceholder,
}) => {
  const [filter, setFilter] = useState('');

  const filteredPlaylists = playlists.filter((p) =>
    p.name.toLowerCase().includes(filter.toLowerCase()),
  );

  return (
    <DropdownMenu.Sub>
      <DropdownMenu.SubTrigger
        className={cn(
          'flex w-full cursor-pointer items-center justify-between gap-3 border-t border-transparent px-3 py-2 text-left text-sm outline-none not-last:border-b',
          'data-[highlighted]:bg-background-secondary data-[highlighted]:border-border data-[highlighted]:inset-2',
        )}
        data-testid="submenu-trigger"
      >
        <span className="flex items-center gap-3">
          <span className="shrink-0">{icon}</span>
          <span>{label}</span>
        </span>
        <ChevronRight size={14} />
      </DropdownMenu.SubTrigger>

      <DropdownMenu.Portal>
        <DropdownMenu.SubContent
          className="bg-background border-border data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 z-50 w-48 overflow-hidden rounded-sm border-2 shadow-lg outline-none"
          sideOffset={4}
          data-testid="playlist-submenu"
        >
          {playlists.length > 5 && (
            <div className="border-border border-b px-3 py-2">
              <Input
                placeholder={filterPlaceholder}
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                onKeyDown={(e) => e.stopPropagation()}
                data-testid="playlist-filter-input"
              />
            </div>
          )}
          <div className="max-h-48 overflow-hidden">
            <ScrollableArea fadeScrollbars={false}>
              {filteredPlaylists.map((playlist) => (
                <DropdownMenu.Item
                  key={playlist.id}
                  className={cn(
                    'flex w-full cursor-pointer items-center gap-3 border-t border-transparent px-3 py-2 text-left text-sm outline-none not-last:border-b first:border-t-0',
                    'data-[highlighted]:bg-background-secondary data-[highlighted]:border-border data-[highlighted]:inset-2',
                  )}
                  onClick={() => onSelect(playlist.id)}
                  data-testid="playlist-submenu-item"
                >
                  {playlist.name}
                </DropdownMenu.Item>
              ))}
              {filteredPlaylists.length === 0 && (
                <div className="text-foreground-secondary px-3 py-2 text-sm">
                  No playlists found
                </div>
              )}
            </ScrollableArea>
          </div>
        </DropdownMenu.SubContent>
      </DropdownMenu.Portal>
    </DropdownMenu.Sub>
  );
};
