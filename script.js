const header = document.querySelector('.site-header');
const progress = document.querySelector('.scroll-progress');
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
const year = document.querySelector('#year');
const quoteForm = document.querySelector('#quoteForm');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (year) year.textContent = new Date().getFullYear();

function updateScrollUI() {
  const y = window.scrollY;
  header?.classList.toggle('scrolled', y > 24);
  const doc = document.documentElement;
  const scrollable = doc.scrollHeight - doc.clientHeight;
  const percent = scrollable > 0 ? (doc.scrollTop / scrollable) * 100 : 0;
  if (progress) progress.style.width = `${percent}%`;
}

function closeMenu() {
  nav?.classList.remove('open');
  menuToggle?.setAttribute('aria-expanded', 'false');
  menuToggle?.setAttribute('aria-label', 'Abrir menu');
  document.body.classList.remove('menu-open');
}

updateScrollUI();
window.addEventListener('scroll', updateScrollUI, { passive: true });

menuToggle?.addEventListener('click', () => {
  const isOpen = nav?.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(Boolean(isOpen)));
  menuToggle.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
  document.body.classList.toggle('menu-open', Boolean(isOpen));
});

document.querySelectorAll('.nav a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
document.addEventListener('click', event => {
  if (!nav?.classList.contains('open')) return;
  if (!nav.contains(event.target) && !menuToggle?.contains(event.target)) closeMenu();
});

if (!reducedMotion && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const delay = Number(entry.target.dataset.delay || 0);
      window.setTimeout(() => entry.target.classList.add('is-visible'), delay);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -35px 0px' });
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
  orbit?.addEventListener('pointerleave', () => { if (visual) visual.style.transform = 'rotate(-4deg)'; });
}

quoteForm?.addEventListener('submit', event => {
  event.preventDefault();
  const data = new FormData(quoteForm);
  const nome = String(data.get('nome') || '').trim();
  const servico = String(data.get('servico') || '').trim();
  const mensagem = String(data.get('mensagem') || '').trim();

  if (!nome || !servico || !mensagem) return;

  const text = [
    'Olá! Vi o site da Neri InfoTech e gostaria de solicitar um orçamento.',
    '',
    `Nome: ${nome}`,
    `Serviço: ${servico}`,
    '',
    'Detalhes:',
    mensagem
  ].join('\n');

  const url = `https://wa.me/5575999294419?text=${encodeURIComponent(text)}`;
  window.open(url, '_blank', 'noopener,noreferrer');
});

// Mantém apenas um item do FAQ aberto por vez para a leitura ficar mais limpa.
document.querySelectorAll('.faq-list details').forEach(item => {
  item.addEventListener('toggle', () => {
    if (!item.open) return;
    document.querySelectorAll('.faq-list details[open]').forEach(other => {
      if (other !== item) other.removeAttribute('open');
    });
  });
});