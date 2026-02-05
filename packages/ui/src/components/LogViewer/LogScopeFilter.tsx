import { FC, useMemo } from 'react';

import { FilterChips } from '../FilterChips';
import { useLogViewerContext } from './context';

export const LogScopeFilter: FC = () => {
  const { scopes, selectedScopes, setSelectedScopes, labels } =
    useLogViewerContext();

  const items = useMemo(
    () => scopes.map((scope) => ({ id: scope, label: scope })),
    [scopes],
  );

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-foreground/60 text-sm">{labels.scopeLabel}</span>
      <FilterChips
        multiple
        items={items}
        selected={selectedScopes}
        onChange={setSelectedScopes}
      />
    </div>
  );
};
