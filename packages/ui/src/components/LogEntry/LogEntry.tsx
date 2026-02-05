import { cva } from 'class-variance-authority';
import { DateTime } from 'luxon';
import { ComponentProps, FC } from 'react';

import { cn } from '../../utils';

export type LogLevel = 'trace' | 'debug' | 'info' | 'warn' | 'error';

export type LogEntryData = {
  id: string;
  timestamp: Date;
  level: LogLevel;
  source: {
    type: 'core' | 'plugin';
    scope: string;
  };
  message: string;
};

const levelBadgeVariants = cva(
  'inline-flex w-14 items-center justify-center rounded px-1.5 py-0.5 text-xs font-bold uppercase',
  {
    variants: {
      level: {
        error: 'bg-accent-red text-foreground',
        warn: 'bg-accent-yellow text-foreground',
        info: 'bg-accent-cyan text-foreground',
        debug: 'bg-accent-purple text-foreground',
        trace: 'bg-foreground/50 text-background',
      },
    },
  },
);

const sourceChipVariants = cva(
  'inline-flex items-center justify-center rounded-full px-2 py-0.5 text-xs font-medium',
  {
    variants: {
      type: {
        core: 'bg-foreground/10 text-foreground',
        plugin: 'bg-accent-orange/50 text-foreground',
      },
    },
  },
);

export type LogEntryProps = ComponentProps<'div'> & {
  entry: LogEntryData;
};

export const LogEntry: FC<LogEntryProps> = ({ entry, className, ...props }) => {
  const formattedTime = DateTime.fromJSDate(entry.timestamp).toFormat(
    'HH:mm:ss.SSS',
  );

  return (
    <div
      className={cn(
        'grid grid-cols-[auto_auto_auto_1fr] items-start gap-2 px-2 py-1 font-mono text-sm',
        className,
      )}
      {...props}
    >
      <span className="text-foreground/60 whitespace-nowrap">
        {formattedTime}
      </span>
      <span className={levelBadgeVariants({ level: entry.level })}>
        {entry.level.toUpperCase()}
      </span>
      <span className={sourceChipVariants({ type: entry.source.type })}>
        {entry.source.scope}
      </span>
      <span className="text-foreground break-all whitespace-pre-wrap">
        {entry.message}
      </span>
    </div>
  );
};
