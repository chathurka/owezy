'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextValue {
  /** The user's stored preference. */
  mode: ThemeMode;
  /** The actually applied theme, resolved from mode + OS preference. */
  resolved: 'light' | 'dark';
  setMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  mode: 'system',
  resolved: 'light',
  setMode: () => {},
});

export function useTheme(): ThemeContextValue {
  return useContext(ThemeContext);
}

const STORAGE_KEY = 'owezy-admin-theme';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>('system');
  const [resolved, setResolved] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
    if (stored === 'light' || stored === 'dark' || stored === 'system') {
      setModeState(stored);
    }
  }, []);

  useEffect(() => {
    function resolveAndApply(m: ThemeMode) {
      const r: 'light' | 'dark' =
        m === 'system'
          ? window.matchMedia('(prefers-color-scheme: dark)').matches
            ? 'dark'
            : 'light'
          : m;
      setResolved(r);
      document.documentElement.setAttribute('data-theme', r);
    }

    resolveAndApply(mode);

    if (mode === 'system') {
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      const handler = () => resolveAndApply('system');
      mq.addEventListener('change', handler);
      return () => mq.removeEventListener('change', handler);
    }
  }, [mode]);

  function setMode(m: ThemeMode) {
    localStorage.setItem(STORAGE_KEY, m);
    setModeState(m);
  }

  return (
    <ThemeContext.Provider value={{ mode, resolved, setMode }}>
      {children}
    </ThemeContext.Provider>
  );
}
