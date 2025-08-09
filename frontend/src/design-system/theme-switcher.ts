import light from './tokens/themes/light.json';
import dark from './tokens/themes/dark.json';

export type ThemeName = 'light' | 'dark';

const themes: Record<ThemeName, Record<string, string>> = {
  light,
  dark,
};

export function setTheme(themeName: ThemeName): void {
  const theme = themes[themeName];
  if (!theme) {
    console.warn(`Theme "${themeName}" not found`);
    return;
  }
  const root = document.documentElement;
  Object.entries(theme).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });
  root.dataset.theme = themeName;
}

export function toggleTheme(): void {
  const current =
    (document.documentElement.dataset.theme as ThemeName) || 'light';
  const next = current === 'light' ? 'dark' : 'light';
  setTheme(next);
}
