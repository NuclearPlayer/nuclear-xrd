import { FC } from 'react';

import { useTranslation } from '@nuclearplayer/i18n';
import { Badge, TopBar, TopBarLogo } from '@nuclearplayer/ui';

import { useUpdaterStore } from '../stores/updaterStore';
import { SearchBox } from './SearchBox';

export const ConnectedTopBar: FC = () => {
  const { t } = useTranslation('updater');
  const isUpdateAvailable = useUpdaterStore((state) => state.isUpdateAvailable);

  return (
    <TopBar>
      <div className="flex flex-row items-center gap-4">
        <TopBarLogo />
        {isUpdateAvailable && (
          <Badge variant="pill" color="green" className="ml-2">
            {t('updateAvailable')}
          </Badge>
        )}
      </div>
      <SearchBox />
    </TopBar>
  );
};
