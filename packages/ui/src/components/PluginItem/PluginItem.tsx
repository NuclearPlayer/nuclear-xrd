import { SettingsIcon, TriangleAlertIcon } from 'lucide-react';
import { FC, ReactNode } from 'react';

import { cn } from '../../utils';
import { Box } from '../Box';
import { Button } from '../Button';

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
}) => {
  return (
    <Box
      variant="secondary"
      className={cn(
        {
          'ring-2 ring-accent-orange ring-inset': warning,
          'opacity-30': disabled,
        },
        'relative transition-opacity duration-250',
        className,
      )}
    >
      <div className={'flex flex-wrap items-start gap-4 w-full'}>
        {icon && (
          <Box
            variant="tertiary"
            shadow="none"
            className="flex-shrink-0 w-12 h-12 p-0 items-center justify-center overflow-hidden"
          >
            {icon}
          </Box>
        )}

        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-foreground text-lg gap-4 leading-tight inline-flex items-center">
            {name}
            {onViewDetails && (
              <Button size="icon" onClick={onViewDetails} disabled={disabled}>
                <SettingsIcon size={20} />
              </Button>
            )}
          </h3>
          <p className="text-sm text-foreground-secondary mt-1">by {author}</p>
          <p className="text-sm text-foreground-secondary mt-2 leading-relaxed">
            {description}
          </p>
        </div>

        {/* TODO: Add a tooltip for the warning text */}
        {(warning || warningText) && (
          <div className="absolute -top-4 -left-2 flex items-center w-12 h-12">
            {warning && (
              <span className="inline-flex items-center justify-center bg-accent-orange text-black text-xs font-semibold rounded p-1 border-2 border-border">
                <TriangleAlertIcon className="fill-accent-yellow" />
              </span>
            )}
          </div>
        )}

        <div className="flex flex-col shrink-0 h-full sm:w-auto items-start justify-center sm:items-end">
          {rightAccessory}
        </div>
      </div>
    </Box>
  );
};
