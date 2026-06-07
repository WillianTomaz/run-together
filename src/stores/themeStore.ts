import { create } from 'zustand';

interface ThemeStore {
  isDark: boolean;
  toggle: () => void;
}

const getInitial = (): boolean => {
  const saved = localStorage.getItem('theme');
  if (saved) return saved === 'dark';
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
};

const apply = (dark: boolean) => {
  document.documentElement.classList.toggle('dark', dark);
  localStorage.setItem('theme', dark ? 'dark' : 'light');
};

export const useThemeStore = create<ThemeStore>((set) => {
  const initial = getInitial();
  apply(initial);

  return {
    isDark: initial,
    toggle: () =>
      set((s) => {
        apply(!s.isDark);
        return { isDark: !s.isDark };
      }),
  };
});
