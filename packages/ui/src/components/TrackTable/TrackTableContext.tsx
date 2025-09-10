import { createContext, useContext } from 'react';

export type TrackTableContextValue = {
  isReorderable: boolean;
};

const TrackTableContext = createContext<TrackTableContextValue | null>(null);

export function useTrackTableContext() {
  const ctx = useContext(TrackTableContext);
  if (!ctx) {
    throw new Error(
      'useTrackTableContext must be used within <TrackTableProvider>',
    );
  }
  return ctx;
}

export function TrackTableProvider({
  value,
  children,
}: {
  value: TrackTableContextValue;
  children: React.ReactNode;
}) {
  return (
    <TrackTableContext.Provider value={value}>
      {children}
    </TrackTableContext.Provider>
  );
}
