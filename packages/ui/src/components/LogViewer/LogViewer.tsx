import { useVirtualizer } from '@tanstack/react-virtual';
import { FC, useEffect, useMemo, useRef, useState } from 'react';

import { cn } from '../../utils';
import type { LogEntryData } from '../LogEntry';
import { LogEntry } from '../LogEntry';
import { LogLevelFilter } from './LogLevelFilter';
import { LogScopeFilter } from './LogScopeFilter';
import { LogSearchInput } from './LogSearchInput';
import { LogToolbar } from './LogToolbar';

const ESTIMATED_ROW_HEIGHT = 32;

export type LogViewerProps = {
  logs: LogEntryData[];
  scopes: string[];
  onClear: () => void;
  onExport: () => void | Promise<void>;
  onOpenLogFolder: () => void;
  className?: string;
};

type SearchResult = {
  regex: RegExp | null;
  isValid: boolean;
};

const parseSearch = (pattern: string): SearchResult => {
  if (!pattern) {
    return { regex: null, isValid: true };
  }
  try {
    return { regex: new RegExp(pattern, 'i'), isValid: true };
  } catch {
    return { regex: null, isValid: false };
  }
};

export const LogViewer: FC<LogViewerProps> = ({
  logs,
  scopes,
  onClear,
  onExport,
  onOpenLogFolder,
  className,
}) => {
  const [search, setSearch] = useState('');
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
  const [selectedScopes, setSelectedScopes] = useState<string[]>([]);
  const parentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSelectedScopes((prev) => prev.filter((s) => scopes.includes(s)));
  }, [scopes]);

  const searchResult = useMemo(() => parseSearch(search), [search]);

  const filteredLogs = useMemo(() => {
    const { regex, isValid } = searchResult;
    if (!isValid) {
      return [];
    }

    return logs.filter((log) => {
      if (selectedLevels.length > 0 && !selectedLevels.includes(log.level)) {
        return false;
      }
      if (
        selectedScopes.length > 0 &&
        !selectedScopes.includes(log.source.scope)
      ) {
        return false;
      }
      if (regex && !regex.test(log.message)) {
        return false;
      }
      return true;
    });
  }, [logs, searchResult, selectedLevels, selectedScopes]);

  const virtualizer = useVirtualizer({
    count: filteredLogs.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => ESTIMATED_ROW_HEIGHT,
    overscan: 5,
  });

  const entryCount = filteredLogs.length;
  const entryLabel = entryCount === 1 ? 'entry' : 'entries';

  return (
    <div className={cn('flex h-full flex-col gap-4', className)}>
      <div className="flex flex-wrap items-center gap-4">
        <LogSearchInput
          value={search}
          onChange={setSearch}
          isValid={searchResult.isValid}
        />
        <LogToolbar
          onClear={onClear}
          onExport={onExport}
          onOpenLogFolder={onOpenLogFolder}
        />
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <LogLevelFilter
          selected={selectedLevels}
          onChange={setSelectedLevels}
        />
        <LogScopeFilter
          scopes={scopes}
          selected={selectedScopes}
          onChange={setSelectedScopes}
        />
        <span className="text-foreground/60 ml-auto text-sm">
          {entryCount} {entryLabel}
        </span>
      </div>

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
              ? 'No logs to display'
              : 'Invalid regex pattern'}
          </div>
        ) : (
          <div
            style={{
              height: virtualizer.getTotalSize(),
              width: '100%',
              position: 'relative',
            }}
          >
            {virtualizer.getVirtualItems().map((virtualRow) => {
              const log = filteredLogs[virtualRow.index];
              return (
                <div
                  key={virtualRow.key}
                  data-index={virtualRow.index}
                  ref={virtualizer.measureElement}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                >
                  <LogEntry entry={log} />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
