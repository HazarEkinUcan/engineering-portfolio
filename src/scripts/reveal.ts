/**
 * Scroll reveal fallback for browsers without scroll-driven animations.
 *
 * The class that hides content is only ever added by this script, so if the
 * script fails to load nothing is invisible. Reveals fire once and never
 * replay on scroll-up. design-spec.md §7.1.
 */
export function initReveal(): void {
  const supportsScrollTimeline =
    typeof CSS !== 'undefined' && CSS.supports('animation-timeline: view()');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (supportsScrollTimeline || reducedMotion) return;

  const targets = document.querySelectorAll<HTMLElement>('.reveal');
  if (!targets.length) return;

  document.documentElement.classList.add('reveal-js');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.2, rootMargin: '0px 0px -8% 0px' },
  );

  targets.forEach((target) => observer.observe(target));
}
