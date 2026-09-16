const header = document.querySelector('.site-header');
const progress = document.querySelector('.scroll-progress');
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
const year = document.querySelector('#year');

if (year) year.textContent = new Date().getFullYear();

function updateScrollUI() {
  const y = window.scrollY;
  header?.classList.toggle('scrolled', y > 24);

  const doc = document.documentElement;
  const scrollable = doc.scrollHeight - doc.clientHeight;
  const percent = scrollable > 0 ? (doc.scrollTop / scrollable) * 100 : 0;
  if (progress) progress.style.width = `${percent}%`;
}

updateScrollUI();
window.addEventListener('scroll', updateScrollUI, { passive: true });

menuToggle?.addEventListener('click', () => {
  const isOpen = nav?.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(Boolean(isOpen)));
  menuToggle.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
});

document.querySelectorAll('.nav a').forEach(link => {
  link.addEventListener('click', () => {
    nav?.classList.remove('open');
    menuToggle?.setAttribute('aria-expanded', 'false');
    menuToggle?.setAttribute('aria-label', 'Abrir menu');
  });
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    nav?.classList.remove('open');
    menuToggle?.setAttribute('aria-expanded', 'false');
  }
});

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!reducedMotion && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const delay = Number(entry.target.dataset.delay || 0);
      window.setTimeout(() => entry.target.classList.add('is-visible'), delay);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -35px 0px' });

  document.querySelectorAll('.reveal').forEach(element => observer.observe(element));
} else {
  document.querySelectorAll('.reveal').forEach(element => element.classList.add('is-visible'));
}

if (!reducedMotion) {
  const visual = document.querySelector('.brand-core');
  const orbit = document.querySelector('.brand-orbit');

  orbit?.addEventListener('pointermove', event => {
    const rect = orbit.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    if (visual) visual.style.transform = `rotate(-4deg) perspective(900px) rotateX(${y * -5}deg) rotateY(${x * 7}deg)`;
  });

  orbit?.addEventListener('pointerleave', () => {
    if (visual) visual.style.transform = 'rotate(-4deg)';
  });
}
