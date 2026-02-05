import { FC } from 'react';

import { useLogViewerContext } from './context';

export const LogEntryCount: FC = () => {
  const { filteredLogs } = useLogViewerContext();
  const count = filteredLogs.length;
  const label = count === 1 ? 'entry' : 'entries';

  return (
    <span className="text-foreground/60 ml-auto text-sm">
      {count} {label}
    </span>
  );
};
