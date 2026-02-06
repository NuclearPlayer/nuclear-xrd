import { Search } from 'lucide-react';
import { FC } from 'react';

import { Input } from '../Input';
import { useLogViewerContext } from './context';

export const LogSearchInput: FC = () => {
  const { search, setSearch, searchResult, labels } = useLogViewerContext();

  return (
    <div className="min-w-48 flex-1">
      <Input
        aria-label={labels.searchAriaLabel}
        placeholder={labels.searchPlaceholder}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        state={searchResult.isValid ? 'normal' : 'error'}
        endAddon={<Search className="size-4" />}
      />
    </div>
  );
};
