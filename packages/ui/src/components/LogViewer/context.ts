import { createContext, useContext } from 'react';

import type { LogEntryData } from '../LogEntry';

type SearchResult = {
  regex: RegExp | null;
  isValid: boolean;
};

export type LogViewerContextValue = {
  logs: LogEntryData[];
  filteredLogs: LogEntryData[];
  scopes: string[];

  search: string;
  setSearch: (value: string) => void;
  searchResult: SearchResult;

  selectedLevels: string[];
  setSelectedLevels: (levels: string[]) => void;

  selectedScopes: string[];
  setSelectedScopes: (scopes: string[]) => void;

  onClear: () => void;
  onExport: () => void | Promise<void>;
  onOpenLogFolder: () => void;
};

export const LogViewerContext = createContext<LogViewerContextValue | null>(
  null,
);

export const useLogViewerContext = () => {
  const ctx = useContext(LogViewerContext);
  if (!ctx) {
    throw new Error('LogViewer.* must be used within <LogViewer.Root>');
  }
  return ctx;
};

export const parseSearch = (pattern: string): SearchResult => {
  if (!pattern) {
    return { regex: null, isValid: true };
  }
  try {
    return { regex: new RegExp(pattern, 'i'), isValid: true };
  } catch {
    return { regex: null, isValid: false };
  }
};
