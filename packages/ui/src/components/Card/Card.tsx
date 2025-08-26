import { CassetteTape } from 'lucide-react';
import { FC } from 'react';

import { cn } from '../../utils';
import { Box } from '../Box';
import { Button } from '../Button';

type CardProps = {
  src: string;
  title?: string;
  subtitle?: string;
  className?: string;
  onClick?: () => void;
};

export const Card: FC<CardProps> = ({
  src,
  title,
  subtitle,
  className,
  onClick,
}) => {
  return (
    <Button
      size="flexible"
      className={cn(
        'flex w-42 flex-col items-stretch gap-2 p-2 text-left',
        className,
      )}
      onClick={onClick}
    >
      <Box
        variant="primary"
        shadow="none"
        className="aspect-square w-full items-center justify-center overflow-hidden p-0"
      >
        {src && (
          <img src={src} alt={title} className="h-full w-full object-cover" />
        )}
        {!src && <CassetteTape size={96} absoluteStrokeWidth />}
      </Box>

      {(title || subtitle) && (
        <div className="min-w-0">
          {title && (
            <div className="text-foreground truncate text-sm font-bold">
              {title}
            </div>
          )}
          {subtitle && (
            <div className="text-foreground-secondary truncate text-xs">
              {subtitle}
            </div>
          )}
        </div>
      )}
    </Button>
  );
};
