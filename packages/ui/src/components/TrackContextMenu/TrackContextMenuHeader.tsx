import { FC } from 'react';

type TrackContextMenuHeaderProps = {
  title: string;
  subtitle?: string;
  coverUrl?: string;
};

export const TrackContextMenuHeader: FC<TrackContextMenuHeaderProps> = ({
  title,
  subtitle,
  coverUrl,
}) => {
  return (
    <div className="border-border flex items-center gap-3 border-b">
      {coverUrl && (
        <img
          src={coverUrl}
          alt=""
          className="border-border size-16 border-r object-cover"
        />
      )}
      <div className="min-w-0 flex-1 py-3 pr-3">
        <div className="text-foreground truncate text-sm font-bold">
          {title}
        </div>
        {subtitle && (
          <div className="text-foreground-secondary truncate text-xs">
            {subtitle}
          </div>
        )}
      </div>
    </div>
  );
};
