/**
 * The header's quick-access dropdowns — Work and Ongoing, and any that follow.
 *
 * One implementation drives them all, which is what keeps their behaviour from
 * drifting apart, and is also what makes mutual exclusion trivial: opening one
 * closes every other, because they are all in the same list.
 *
 * Click, not hover. A hover-opened menu is unusable with a keyboard, unreachable
 * on touch, and opens itself on the way past — so each trigger is a real button
 * with aria-expanded, and pointing at it does nothing.
 *
 * A panel closes on a second click of its trigger, on a click outside it, on
 * Escape, on choosing a project, on tabbing out of it, on another panel opening,
 * and on a resize down to the mobile breakpoint where the nav itself disappears.
 * Arrow keys walk the list, because that is what a menu button opened from the
 * keyboard is expected to do.
 *
 * A panel with no rows is a supported state: it opens, shows its empty label,
 * and every focus call below is optional-chained so nothing throws.
 *
 * Mobile needs none of this — the nested lists inside the menu sheet are plain
 * markup that is already visible once the sheet is open.
 */
interface NavMenu {
  root: HTMLElement;
  toggle: HTMLButtonElement;
  panel: HTMLElement;
  open: boolean;
}

export function initNavMenus(): void {
  const menus: NavMenu[] = Array.from(
    document.querySelectorAll<HTMLElement>('[data-nav-menu]'),
  ).flatMap((root) => {
    const toggle = root.querySelector<HTMLButtonElement>('[data-nav-toggle]');
    const panel = root.querySelector<HTMLElement>('[data-nav-panel]');
    return toggle && panel ? [{ root, toggle, panel, open: false }] : [];
  });
  if (!menus.length) return;

  const items = (menu: NavMenu): HTMLAnchorElement[] =>
    Array.from(menu.panel.querySelectorAll<HTMLAnchorElement>('a'));

  const setOpen = (
    menu: NavMenu,
    next: boolean,
    focus: 'trigger' | 'first' | 'none' = 'none',
  ): void => {
    // Never two at once: opening one closes the rest before it opens itself.
    if (next) {
      for (const other of menus) {
        if (other !== menu && other.open) setOpen(other, false);
      }
    }
    if (next !== menu.open) {
      menu.open = next;
      menu.panel.hidden = !next;
      menu.toggle.setAttribute('aria-expanded', String(next));
    }
    if (focus === 'first' && menu.open) items(menu)[0]?.focus();
    if (focus === 'trigger') menu.toggle.focus();
  };

  const openMenu = (): NavMenu | undefined => menus.find((menu) => menu.open);

  for (const menu of menus) {
    menu.toggle.addEventListener('click', () => setOpen(menu, !menu.open));

    menu.toggle.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        setOpen(menu, true, 'first');
      }
    });

    // Selecting a project closes the panel. Most of these navigate away anyway,
    // but the footer link is a same-page hash on the homepage and would
    // otherwise leave the panel open over the section it just scrolled to.
    menu.panel.addEventListener('click', (event) => {
      if ((event.target as HTMLElement).closest('a')) setOpen(menu, false);
    });

    menu.panel.addEventListener('keydown', (event) => {
      const list = items(menu);
      const at = list.indexOf(document.activeElement as HTMLAnchorElement);
      if (at === -1) return;

      if (event.key === 'ArrowDown') {
        event.preventDefault();
        list[(at + 1) % list.length]?.focus();
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        list[(at - 1 + list.length) % list.length]?.focus();
      } else if (event.key === 'Home') {
        event.preventDefault();
        list[0]?.focus();
      } else if (event.key === 'End') {
        event.preventDefault();
        list[list.length - 1]?.focus();
      }
    });

    // Tabbing past the last item leaves the panel; it should not stay open
    // behind the focus. relatedTarget is null when focus leaves the document
    // entirely, which is not a reason to close. Moving into another trigger is
    // handled by that trigger's own click/keydown.
    menu.root.addEventListener('focusout', (event) => {
      const next = event.relatedTarget as Node | null;
      if (menu.open && next && !menu.root.contains(next)) setOpen(menu, false);
    });
  }

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    const menu = openMenu();
    if (menu) setOpen(menu, false, 'trigger');
  });

  document.addEventListener('click', (event) => {
    const menu = openMenu();
    if (menu && !menu.root.contains(event.target as Node)) setOpen(menu, false);
  });

  window.matchMedia('(min-width: 1024px)').addEventListener('change', (event) => {
    if (event.matches) return;
    for (const menu of menus) setOpen(menu, false);
  });
}
