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
    <div className="border-border flex items-center gap-3 border-b p-3">
      {coverUrl && (
        <img
          src={coverUrl}
          alt=""
          className="border-border size-10 rounded border object-cover"
        />
      )}
      <div className="min-w-0 flex-1">
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
