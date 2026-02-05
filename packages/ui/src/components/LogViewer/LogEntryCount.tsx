import { FC } from 'react';

import { useLogViewerContext } from './context';

export const LogEntryCount: FC = () => {
  const { filteredLogs, labels } = useLogViewerContext();

  return (
    <span className="text-foreground/60 ml-auto text-sm">
      {labels.entryCount(filteredLogs.length)}
    </span>
  );
};
