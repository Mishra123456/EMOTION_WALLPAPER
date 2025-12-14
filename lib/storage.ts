/**
 * Theme management utilities
 */

const THEME_KEY = 'moodcraft_theme';

export type Theme = 'light' | 'dark' | 'system';

export function getStoredTheme(): Theme {
  if (typeof window === 'undefined') return 'system';
  try {
    const stored = localStorage.getItem(THEME_KEY);
    return (stored as Theme) || 'system';
  } catch {
    return 'system';
  }
}

export function setStoredTheme(theme: Theme): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch (error) {
    console.error('Failed to save theme:', error);
  }
}

export function applyTheme(theme: Theme): void {
  if (typeof window === 'undefined') return;
  
  const root = document.documentElement;
  
  if (theme === 'system') {
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    root.classList.toggle('dark', systemPrefersDark);
  } else {
    root.classList.toggle('dark', theme === 'dark');
  }
}

