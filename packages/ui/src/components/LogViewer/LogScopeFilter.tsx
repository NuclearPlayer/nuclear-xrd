import { FC, useMemo } from 'react';

import { FilterChips } from '../FilterChips';

export type LogScopeFilterProps = {
  scopes: string[];
  selected: string[];
  onChange: (scopes: string[]) => void;
};

export const LogScopeFilter: FC<LogScopeFilterProps> = ({
  scopes,
  selected,
  onChange,
}) => {
  const items = useMemo(
    () => scopes.map((scope) => ({ id: scope, label: scope })),
    [scopes],
  );

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-foreground/60 text-sm">Scope:</span>
      <FilterChips
        multiple
        items={items}
        selected={selected}
        onChange={onChange}
      />
    </div>
  );
};
