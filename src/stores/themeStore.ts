import { create } from 'zustand';
import type { ThemeMode } from '../types';

interface ThemeState {
  mode: ThemeMode;
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;
}

const getInitialTheme = (): ThemeMode => {
  const stored = localStorage.getItem('autovision-theme');
  if (stored === 'day' || stored === 'night') return stored;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'night' : 'day';
};

export const useThemeStore = create<ThemeState>((set) => ({
  mode: getInitialTheme(),
  toggleTheme: () =>
    set((state) => {
      const next = state.mode === 'day' ? 'night' : 'day';
      localStorage.setItem('autovision-theme', next);
      document.documentElement.setAttribute('data-theme', next === 'night' ? 'dark' : '');
      return { mode: next };
    }),
  setTheme: (mode) => {
    localStorage.setItem('autovision-theme', mode);
    document.documentElement.setAttribute('data-theme', mode === 'night' ? 'dark' : '');
    set({ mode });
  },
}));
