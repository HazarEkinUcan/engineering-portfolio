import { initTheme } from './theme';
import { initReveal } from './reveal';
import { initMenu } from './menu';
import { initNavMenus } from './navMenus';
import { initHeader } from './header';
import { initSectionRail } from './sectionRail';
import { initCopyEmail } from './copyEmail';
import { initCardVideo } from './cardVideo';
import { initHeroRobot } from './heroRobot';

function boot(): void {
  initTheme();
  initReveal();
  initMenu();
  initNavMenus();
  initHeader();
  initSectionRail();
  initCopyEmail();
  initCardVideo();
  initHeroRobot();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot, { once: true });
} else {
  boot();
}
