// Carousel + "how it works" video autoplay.

const SLIDES = [
  { group: 'Shared links', title: 'Dashboard', src: 'assets/01-sharedlinks-dashboard.png', caption: 'Every link is counted — Anyone with the link, external and guest, internal — and removals and extensions too.' },
  { group: 'Shared links', title: 'My links', src: 'assets/02-sharedlinks-my-links.png', caption: 'What one person sees: their own links, grouped by site, with who each went to and when it expires.' },
  { group: 'Shared links', title: 'Reports', src: 'assets/03-sharedlinks-reports.png', caption: 'The tenant-wide view — every new link on every site, other people’s OneDrives included.' },
  { group: 'Shared links', title: 'Auditlog', src: 'assets/04-sharedlinks-auditlog.png', caption: 'The bot made the change; the log names the person who pressed. Expiry extended — the same link kept working.' },
  { group: 'Guest access', title: 'My guests', src: 'assets/06-guest-my-guests.png', caption: 'Accepted or still pending, when each guest is next asked about, and who is main contact versus also invited.' },
  { group: 'Guest access', title: 'Report', src: 'assets/07-guest-report.png', caption: 'Every guest it watches, grouped by who is answerable. No main contact: 0 — every one has someone.' },
  { group: 'Guest access', title: 'Guest detail', src: 'assets/08-guest-detail.png', caption: 'Lars Bisgaard reaches three places. The one you shared is named; the two shared by someone else are counted, not listed.' },
];

function initCarousel() {
  const root = document.querySelector('[data-carousel]');
  if (!root) return;
  const img = root.querySelector('[data-shot]');
  const title = root.querySelector('[data-shot-title]');
  const caption = root.querySelector('[data-shot-caption]');
  const counter = root.querySelector('[data-counter]');
  const pills = [...root.querySelectorAll('[data-slide]')];
  const pad = (n) => String(n).padStart(2, '0');
  let current = 0;

  function go(i) {
    const n = SLIDES.length;
    current = ((i % n) + n) % n;
    const s = SLIDES[current];
    img.src = s.src;
    img.alt = `${s.group} — ${s.title}, inside Teams`;
    title.textContent = `${s.group} · ${s.title}`;
    caption.textContent = s.caption;
    counter.textContent = `${pad(current + 1)} / ${pad(n)}`;
    pills.forEach((p) => p.setAttribute('aria-pressed', String(+p.dataset.slide === current)));
  }

  pills.forEach((p) => p.addEventListener('click', () => go(+p.dataset.slide)));
  root.querySelector('[data-prev]').addEventListener('click', () => go(current - 1));
  root.querySelector('[data-next]').addEventListener('click', () => go(current + 1));
  window.addEventListener('keydown', (e) => {
    if (!root.contains(document.activeElement)) return;
    if (e.key === 'ArrowRight') go(current + 1);
    if (e.key === 'ArrowLeft') go(current - 1);
  });

  document.querySelectorAll('[data-show-slide]').forEach((a) => a.addEventListener('click', (e) => {
    e.preventDefault();
    go(+a.dataset.showSlide);
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: root.getBoundingClientRect().top + window.scrollY - 90, behavior: reduce ? 'auto' : 'smooth' });
  }));

  // Warm the cache so switching slides doesn't flash.
  const preload = () => SLIDES.forEach((s) => { new Image().src = s.src; });
  if ('requestIdleCallback' in window) requestIdleCallback(preload); else setTimeout(preload, 2000);
}

function initVideo() {
  const video = document.getElementById('how-video');
  if (!video || !('IntersectionObserver' in window)) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // Autoplay once when ≥ 40% visible; pause when scrolled away, resume on return.
  // Hands off once the viewer pauses it themselves or it has played through.
  let auto = true;
  let pausedByScroll = false;
  video.addEventListener('ended', () => { auto = false; });
  video.addEventListener('pause', () => { if (!pausedByScroll && !video.ended) auto = false; });

  new IntersectionObserver(([entry]) => {
    if (!auto) return;
    if (entry.isIntersecting) {
      pausedByScroll = false;
      video.play().catch(() => {});
    } else if (!video.paused) {
      pausedByScroll = true;
      video.pause();
    }
  }, { threshold: 0.4 }).observe(video);
}

initCarousel();
initVideo();
