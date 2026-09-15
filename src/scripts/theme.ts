/**
 * Theme toggle. The blocking inline script in Base.astro has already applied
 * the visitor's saved preference before first paint; this only wires the button.
 *
 * The rule is: a saved preference, otherwise dark. The operating system's
 * prefers-color-scheme is not part of it — dark is the portfolio's designed
 * default, not a guess at what the visitor's machine is doing.
 */
type Theme = 'light' | 'dark';

const STORAGE_KEY = 'theme';

/** What a visitor who has never chosen gets, every time. */
const DEFAULT_THEME: Theme = 'dark';

function currentTheme(): Theme {
  const attr = document.documentElement.dataset.theme;
  return attr === 'dark' || attr === 'light' ? attr : DEFAULT_THEME;
}

function apply(theme: Theme): void {
  document.documentElement.dataset.theme = theme;
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    /* Storage can throw in a private window. The toggle still works. */
  }
  document.querySelectorAll<HTMLButtonElement>('[data-theme-toggle]').forEach((button) => {
    button.setAttribute('aria-pressed', String(theme === 'dark'));
  });
}

export function initTheme(): void {
  const buttons = document.querySelectorAll<HTMLButtonElement>('[data-theme-toggle]');
  if (!buttons.length) return;

  const theme = currentTheme();
  buttons.forEach((button) => {
    button.hidden = false;
    button.setAttribute('aria-pressed', String(theme === 'dark'));
    button.addEventListener('click', () => {
      apply(currentTheme() === 'dark' ? 'light' : 'dark');
    });
  });
}
