import {
  ListMusic,
  LucideIcon,
  MapPin,
  Music,
  UserPlus,
  Users,
} from 'lucide-react';
import { FC } from 'react';

import { useTranslation } from '@nuclearplayer/i18n';
import { pickArtwork } from '@nuclearplayer/model';
import { Loader } from '@nuclearplayer/ui';

import { useArtistSocialStats } from '../hooks/useArtistSocialStats';

const AVATAR_SIZE_PX = 300;

const compactFormatter = new Intl.NumberFormat('en', { notation: 'compact' });

const formatCompact = (value: number): string => compactFormatter.format(value);

type StatDefinition = {
  key: string;
  icon: LucideIcon;
  labelKey: string;
  value: number | undefined;
};

type ActiveStat = StatDefinition & { value: number };

type ArtistSocialHeaderProps = {
  providerId: string;
  artistId: string;
};

export const ArtistSocialHeader: FC<ArtistSocialHeaderProps> = ({
  providerId,
  artistId,
}) => {
  const { t } = useTranslation('artist');
  const {
    data: stats,
    isLoading,
    isError,
  } = useArtistSocialStats(providerId, artistId);

  if (isLoading) {
    return (
      <div
        className="flex items-center justify-center p-8"
        data-testid="artist-social-header"
      >
        <Loader data-testid="artist-social-header-loader" />
      </div>
    );
  }

  if (isError) {
    return (
      <div
        className="flex flex-col items-start gap-3 p-8"
        data-testid="artist-social-header"
      >
        <div className="text-accent-red">
          {t('errors.failedToLoadSocialStats')}
        </div>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  const avatar = pickArtwork(stats.artwork, 'avatar', AVATAR_SIZE_PX);

  const location = [stats.city, stats.country].filter(Boolean).join(', ');

  const statDefinitions = [
    {
      key: 'followers',
      icon: Users,
      labelKey: 'followers',
      value: stats.followersCount,
    },
    {
      key: 'followings',
      icon: UserPlus,
      labelKey: 'followings',
      value: stats.followingsCount,
    },
    {
      key: 'tracks',
      icon: Music,
      labelKey: 'tracks',
      value: stats.trackCount,
    },
    {
      key: 'playlists',
      icon: ListMusic,
      labelKey: 'playlists',
      value: stats.playlistCount,
    },
  ].filter(
    (stat): stat is ActiveStat => stat.value !== undefined && stat.value > 0,
  );

  return (
    <div
      className="border-border bg-primary shadow-shadow mx-6 mt-6 rounded-md border-2 p-6"
      data-testid="artist-social-header"
    >
      <div className="flex items-center gap-5">
        {avatar && (
          <img
            className="border-border shadow-shadow h-24 w-24 rounded-full border-2 object-cover"
            src={avatar.url}
            alt={`${stats.name} avatar`}
          />
        )}
        <div className="flex flex-col gap-1">
          <h2 className="font-heading text-3xl font-extrabold tracking-tight">
            {stats.name}
          </h2>
          {location && (
            <span className="bg-accent-orange border-border inline-flex w-fit items-center gap-1 rounded-md border px-2 py-0.5 text-sm font-bold">
              <MapPin size={14} />
              {location}
            </span>
          )}
        </div>
      </div>
      {statDefinitions.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-3">
          {statDefinitions.map((stat) => (
            <div
              key={stat.key}
              className="border-border bg-background shadow-shadow flex items-center gap-2 rounded-md border-2 px-3 py-2"
            >
              <stat.icon size={16} className="shrink-0" />
              <span className="font-heading text-lg leading-none font-extrabold">
                {formatCompact(stat.value)}
              </span>
              <span className="text-foreground-secondary text-xs font-bold tracking-wide uppercase">
                {t(stat.labelKey)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
