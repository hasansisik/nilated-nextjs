'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ThemeConfigState {
  headerStyle: number;
  footerStyle: number;
  setHeaderStyle: (style: number) => void;
  setFooterStyle: (style: number) => void;
}

export const useThemeConfig = create<ThemeConfigState>()(
  persist(
    (set) => ({
      headerStyle: 1,
      footerStyle: 1,
      setHeaderStyle: (style) => set({ headerStyle: style }),
      setFooterStyle: (style) => set({ footerStyle: style }),
    }),
    {
      name: 'theme-config-storage',
    }
  )
); 