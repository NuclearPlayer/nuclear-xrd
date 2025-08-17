import { create } from 'zustand';

export type AdvancedThemeFile = {
  path: string;
  name: string;
};

export type AdvancedThemeState = {
  themes: AdvancedThemeFile[];
  setThemes: (themes: AdvancedThemeFile[]) => void;
};

export const useAdvancedThemeStore = create<AdvancedThemeState>((set) => ({
  themes: [],
  setThemes: (themes) => set({ themes }),
}));
