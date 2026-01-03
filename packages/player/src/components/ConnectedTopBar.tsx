import { FC } from 'react';

import { Badge, TopBar, TopBarLogo } from '@nuclearplayer/ui';

import { useUpdaterStore } from '../stores/updaterStore';
import { SearchBox } from './SearchBox';

export const ConnectedTopBar: FC = () => {
  const isUpdateAvailable = useUpdaterStore((state) => state.isUpdateAvailable);

  return (
    <TopBar>
      <div className="flex flex-row items-center gap-4">
        <TopBarLogo />
        {isUpdateAvailable && (
          <Badge variant="pill" color="green" className="ml-2">
            Update available
          </Badge>
        )}
      </div>
      <SearchBox />
    </TopBar>
  );
};
