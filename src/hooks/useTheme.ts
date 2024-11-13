import { useLocalStorage } from './useLocalStorage';

type Theme = 'light' | 'dark' | 'nature' | 'ocean';

export function useTheme() {
  const [theme, setTheme] = useLocalStorage<Theme>('app-theme', 'light');

  const toggleTheme = (newTheme: Theme) => {
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return { theme, toggleTheme };
}