import {
  createContext,
  useContext,
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

  const createPlaylist = async (name: string) => {
    await storeCreatePlaylist(name);
    setIsCreateDialogOpen(false);
  };

  return (
    <PlaylistsContext.Provider
      value={{
        isCreateDialogOpen,
        openCreateDialog: () => setIsCreateDialogOpen(true),
        closeCreateDialog: () => setIsCreateDialogOpen(false),
        createPlaylist,
      }}
    >
      {children}
    </PlaylistsContext.Provider>
  );
};
