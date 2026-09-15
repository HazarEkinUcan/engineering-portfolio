/**
 * The looping card clip plays only while it is on screen, and not at all
 * under reduced motion — where the poster image stands in its place.
 * design-spec.md §7.1 point 7.
 */
export function initCardVideo(): void {
  const videos = document.querySelectorAll<HTMLVideoElement>('video[data-loop]');
  if (!videos.length) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    videos.forEach((video) => {
      video.removeAttribute('autoplay');
      video.pause();
    });
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const video = entry.target as HTMLVideoElement;
        if (entry.isIntersecting) void video.play().catch(() => undefined);
        else video.pause();
      });
    },
    { threshold: 0.25 },
  );

  videos.forEach((video) => observer.observe(video));
}
