import { ExternalLink } from 'lucide-react';
import { FC, ReactNode } from 'react';

import { Box } from '../Box';
import { Button } from '../Button';

type PluginItemProps = {
  name: string;
  author: string;
  description: string;
  icon?: ReactNode;
  onViewDetails?: () => void;
  className?: string;
};

export const PluginItem: FC<PluginItemProps> = ({
  name,
  author,
  description,
  icon,
  onViewDetails,
  className,
}) => {
  return (
    <Box variant="secondary" className={className}>
      <div className="flex items-start gap-4 w-full">
        {icon && (
          <Box
            variant="tertiary"
            shadow="none"
            className="flex-shrink-0 w-12 h-12 p-0 items-center justify-center"
          >
            {icon}
          </Box>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <h3 className="font-bold text-foreground text-lg leading-tight">
                {name}
              </h3>
              <p className="text-sm text-foreground-secondary mt-1">
                by {author}
              </p>
              <p className="text-sm text-foreground-secondary mt-2 leading-relaxed">
                {description}
              </p>
            </div>

            {onViewDetails && (
              <Button
                size="sm"
                variant="noShadow"
                onClick={onViewDetails}
                className="flex-shrink-0"
              >
                <ExternalLink size={14} className="mr-2" />
                View Details
              </Button>
            )}
          </div>
        </div>
      </div>
    </Box>
  );
};
