import { Search } from 'lucide-react';
import { FC } from 'react';

import { Input } from '../Input';
import { useLogViewerContext } from './context';

export const LogSearchInput: FC = () => {
  const { search, setSearch, searchResult } = useLogViewerContext();

  return (
    <div className="min-w-48 flex-1">
      <Input
        aria-label="Search logs"
        placeholder="Search logs..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        state={searchResult.isValid ? 'normal' : 'error'}
        endAddon={<Search className="size-4" />}
      />
    </div>
  );
};
