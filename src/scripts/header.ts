/**
 * Header state and the case-study reading progress line.
 * Both are opacity / transform only; the header never changes height, so
 * nothing reflows. design-spec.md §7.3.
 */
export function initHeader(): void {
  const header = document.querySelector<HTMLElement>('[data-header]');
  if (!header) return;

  const onScroll = (): void => {
    header.classList.toggle('is-scrolled', window.scrollY > 80);
  };

  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  const progress = document.querySelector<HTMLElement>('[data-reading-progress]');
  if (!progress) return;

  const article = document.querySelector<HTMLElement>('[data-article]');
  if (!article) return;

  const update = (): void => {
    const start = article.offsetTop;
    const span = article.offsetHeight - window.innerHeight;
    if (span <= 0) return;
    const ratio = Math.min(Math.max((window.scrollY - start) / span, 0), 1);
    progress.style.transform = `scaleX(${ratio})`;
  };

  update();
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
}
