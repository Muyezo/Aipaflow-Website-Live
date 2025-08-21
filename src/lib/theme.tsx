import { createContext, useContext, useEffect } from 'react';
import { useSettings } from '@/hooks/useSettings';

type Theme = 'light' | 'dark';

type ThemeContextType = {
  theme: Theme;
  setTheme: (theme: Theme) => Promise<void>;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { getSettings, updateSettings } = useSettings();

  useEffect(() => {
    loadTheme();
  }, []);

  async function loadTheme() {
    try {
      const settings = await getSettings();
      if (settings) {
        document.documentElement.classList.toggle('dark', settings.preferences.theme === 'dark');
      }
    } catch (error) {
      console.error('Failed to load theme:', error);
    }
  }

  const setTheme = async (theme: Theme) => {
    try {
      await updateSettings({
        preferences: {
          theme,
          language: 'en', // Preserve existing values
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
      });
      document.documentElement.classList.toggle('dark', theme === 'dark');
    } catch (error) {
      console.error('Failed to update theme:', error);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme: document.documentElement.classList.contains('dark') ? 'dark' : 'light', setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}