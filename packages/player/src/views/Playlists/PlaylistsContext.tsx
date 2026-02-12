import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type FC,
  type PropsWithChildren,
} from 'react';

import { usePlaylistStore } from '../../stores/playlistStore';

type PlaylistsContextValue = {
  isCreateDialogOpen: boolean;
  openCreateDialog: () => void;
  closeCreateDialog: () => void;
  createPlaylist: (name: string) => Promise<void>;
};

const PlaylistsContext = createContext<PlaylistsContextValue | null>(null);

export const usePlaylistsContext = () => {
  const ctx = useContext(PlaylistsContext);
  if (!ctx) {
    throw new Error(
      'usePlaylistsContext must be used within <PlaylistsProvider>',
    );
  }
  return ctx;
};

export const PlaylistsProvider: FC<PropsWithChildren> = ({ children }) => {
  const storeCreatePlaylist = usePlaylistStore((state) => state.createPlaylist);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const openCreateDialog = useCallback(() => setIsCreateDialogOpen(true), []);
  const closeCreateDialog = useCallback(() => setIsCreateDialogOpen(false), []);

  const createPlaylist = useCallback(
    async (name: string) => {
      await storeCreatePlaylist(name);
      setIsCreateDialogOpen(false);
    },
    [storeCreatePlaylist],
  );

  const value = useMemo(
    () => ({
      isCreateDialogOpen,
      openCreateDialog,
      closeCreateDialog,
      createPlaylist,
    }),
    [isCreateDialogOpen, openCreateDialog, closeCreateDialog, createPlaylist],
  );

  return (
    <PlaylistsContext.Provider value={value}>
      {children}
    </PlaylistsContext.Provider>
  );
};
