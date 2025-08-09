import light from './tokens/themes/light.json';
import dark from './tokens/themes/dark.json';

const themes: Record<string, Record<string, string>> = {
  light,
  dark,
};

export function setTheme(themeName: string): void {
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
