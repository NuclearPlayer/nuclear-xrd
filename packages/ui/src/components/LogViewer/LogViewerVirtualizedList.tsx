import { useVirtualizer } from '@tanstack/react-virtual';
import { FC, memo, useCallback, useRef } from 'react';

import { LogEntry } from '../LogEntry';
import { useLogViewerContext } from './context';

const ESTIMATED_ROW_HEIGHT = 32;

const LogViewerVirtualizedListImpl: FC = () => {
  const {
    filteredLogs,
    searchResult,
    labels,
    selectedLevels,
    setSelectedLevels,
    selectedScopes,
    setSelectedScopes,
  } = useLogViewerContext();
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: filteredLogs.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => ESTIMATED_ROW_HEIGHT,
    overscan: 5,
  });

  const handleLevelClick = useCallback(
    (level: string) => {
      if (selectedLevels.length === 1 && selectedLevels[0] === level) {
        setSelectedLevels([]);
      } else {
        setSelectedLevels([level]);
      }
    },
    [selectedLevels, setSelectedLevels],
  );

  const handleScopeClick = useCallback(
    (scope: string) => {
      if (selectedScopes.length === 1 && selectedScopes[0] === scope) {
        setSelectedScopes([]);
      } else {
        setSelectedScopes([scope]);
      }
    },
    [selectedScopes, setSelectedScopes],
  );

  return (
    <div
      ref={parentRef}
      role="log"
      aria-label="Log entries"
      className="border-border bg-background-input flex-1 overflow-auto rounded-md border-2"
    >
      {filteredLogs.length === 0 ? (
        <div
          role="status"
          className="text-foreground/40 flex h-full items-center justify-center p-8 text-center"
        >
          {searchResult.isValid
            ? labels.noLogsMessage
            : labels.invalidRegexMessage}
        </div>
      ) : (
        <div
          className={`relative w-full`}
          style={{
            height: virtualizer.getTotalSize(),
          }}
        >
          {virtualizer.getVirtualItems().map((virtualRow) => {
            const log = filteredLogs[virtualRow.index];
            return (
              <div
                key={virtualRow.key}
                data-index={virtualRow.index}
                ref={virtualizer.measureElement}
                className="absolute top-0 left-0 w-full"
                style={{
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              >
                <LogEntry
                  entry={log}
                  index={virtualRow.index}
                  onLevelClick={handleLevelClick}
                  onScopeClick={handleScopeClick}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export const LogViewerVirtualizedList = memo(LogViewerVirtualizedListImpl);
