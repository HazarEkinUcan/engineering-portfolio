/**
 * Case-study chapter rail. Rendered as a plain anchor list; this only adds
 * the active state, so it degrades to a working table of contents.
 */
export function initSectionRail(): void {
  const rail = document.querySelector<HTMLElement>('[data-section-rail]');
  if (!rail) return;

  const links = Array.from(rail.querySelectorAll<HTMLAnchorElement>('a[href^="#"]'));
  const sections = links
    .map((link) => document.getElementById(decodeURIComponent(link.hash.slice(1))))
    .filter((section): section is HTMLElement => section !== null);

  if (!sections.length) return;

  const setActive = (id: string): void => {
    links.forEach((link) => {
      const isActive = decodeURIComponent(link.hash.slice(1)) === id;
      link.classList.toggle('is-active', isActive);
      if (isActive) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });
  };

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
      if (visible) setActive(visible.target.id);
    },
    { rootMargin: '-20% 0px -65% 0px', threshold: 0 },
  );

  sections.forEach((section) => observer.observe(section));
}
