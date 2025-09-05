import { SettingsIcon, TriangleAlertIcon } from 'lucide-react';
import { FC, ReactNode } from 'react';

import { cn } from '../../utils';
import { Box } from '../Box';
import { Button } from '../Button';
import { Popover } from '../Popover';

type PluginItemProps = {
  name: string;
  author: string;
  description: string;
  icon?: ReactNode;
  onViewDetails?: () => void;
  className?: string;
  disabled?: boolean;
  warning?: boolean;
  warningText?: string;
  rightAccessory?: ReactNode;
  loadTimeMs?: number;
};

export const PluginItem: FC<PluginItemProps> = ({
  name,
  author,
  description,
  icon,
  onViewDetails,
  className,
  disabled = false,
  warning = false,
  warningText,
  rightAccessory,
  loadTimeMs,
}) => (
  <Box
    data-testid="plugin-item"
    variant="secondary"
    className={cn(
      {
        'ring-accent-orange cursor-default ring-2 select-none ring-inset':
          warning,
        'opacity-30': disabled,
      },
      'relative transition-opacity duration-250',
      className,
    )}
  >
    <div className={'flex w-full flex-wrap items-start gap-4'}>
      {icon && (
        <Box
          variant="tertiary"
          shadow="none"
          className="h-12 w-12 flex-shrink-0 items-center justify-center overflow-hidden p-0"
        >
          {icon}
        </Box>
      )}

      <div className="min-w-0 flex-1">
        <h3
          data-testid="plugin-name"
          className="text-foreground inline-flex items-center gap-4 text-lg leading-tight font-bold"
        >
          {name}
          {onViewDetails && (
            <Button size="icon" onClick={onViewDetails} disabled={disabled}>
              <SettingsIcon size={20} />
            </Button>
          )}
        </h3>
        <p
          data-testid="plugin-author"
          className="text-foreground-secondary mt-1 text-sm"
        >
          by {author}
        </p>
        <p
          data-testid="plugin-description"
          className="text-foreground-secondary mt-2 text-sm leading-relaxed"
        >
          {description}
        </p>
      </div>

      {(warning || warningText) && (
        <Popover
          className="-top-4 -left-2"
          anchor="right"
          trigger={
            <div className="relative flex h-12 w-12 items-center">
              {warning && (
                <span className="bg-accent-orange border-border inline-flex items-center justify-center rounded border-2 p-1 text-xs font-semibold text-black">
                  <TriangleAlertIcon className="fill-accent-yellow" />
                </span>
              )}
            </div>
          }
        >
          {warningText}
        </Popover>
      )}

      <div className="flex h-full shrink-0 flex-col items-start justify-center sm:w-auto sm:items-end">
        {rightAccessory}
      </div>
      <span className="text-foreground-secondary absolute right-4 bottom-2 mt-2 text-sm">
        Loaded in {loadTimeMs}ms
      </span>
    </div>
  </Box>
);
