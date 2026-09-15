/**
 * Mobile menu. Focus moves into the panel on open and returns to the trigger
 * on close, the background is inert, Escape closes, body scroll is locked.
 * technical-plan.md §8.
 */
export function initMenu(): void {
  const toggle = document.querySelector<HTMLButtonElement>('[data-menu-toggle]');
  const panel = document.querySelector<HTMLElement>('[data-menu-panel]');
  const main = document.querySelector<HTMLElement>('main');
  const footer = document.querySelector<HTMLElement>('footer');
  if (!toggle || !panel) return;

  let open = false;

  const setInert = (state: boolean): void => {
    [main, footer].forEach((el) => {
      if (el) el.inert = state;
    });
  };

  const setOpen = (next: boolean): void => {
    open = next;
    toggle.setAttribute('aria-expanded', String(next));
    panel.hidden = !next;
    document.body.style.overflow = next ? 'hidden' : '';
    setInert(next);

    if (next) {
      panel.querySelector<HTMLElement>('a, button')?.focus();
    } else {
      toggle.focus();
    }
  };

  toggle.addEventListener('click', () => setOpen(!open));

  panel.addEventListener('click', (event) => {
    if ((event.target as HTMLElement).closest('a')) setOpen(false);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && open) setOpen(false);
  });

  // A resize past the desktop breakpoint must not leave the page inert.
  window.matchMedia('(min-width: 1024px)').addEventListener('change', (event) => {
    if (event.matches && open) setOpen(false);
  });
}
