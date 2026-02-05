import { FC, useMemo } from 'react';

import { FilterChips } from '../FilterChips';
import type { LogLevel } from '../LogEntry';

const ALL_LEVELS: LogLevel[] = ['error', 'warn', 'info', 'debug', 'trace'];

export type LogLevelFilterProps = {
  selected: string[];
  onChange: (levels: string[]) => void;
};

export const LogLevelFilter: FC<LogLevelFilterProps> = ({
  selected,
  onChange,
}) => {
  const items = useMemo(
    () => ALL_LEVELS.map((level) => ({ id: level, label: level })),
    [],
  );

  return (
    <div className="flex items-center gap-2">
      <span className="text-foreground/60 text-sm">Level:</span>
      <FilterChips
        multiple
        items={items}
        selected={selected}
        onChange={onChange}
      />
    </div>
  );
};
