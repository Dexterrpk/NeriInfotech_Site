const header = document.querySelector('.site-header');
const progress = document.querySelector('.scroll-progress');
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
const year = document.querySelector('#year');
const quoteForm = document.querySelector('#quoteForm');
const messageField = document.querySelector('#mensagem');
const charCount = document.querySelector('#charCount');
const whatsappFloat = document.querySelector('.whatsapp-float');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Correção final da identidade visual: usa a imagem oficial como fundo recortado
// pelo círculo, evitando distorção/corte causado por object-fit/zoom conflitantes.
const logoFixStyle = document.createElement('style');
logoFixStyle.id = 'neri-logo-fix';
logoFixStyle.textContent = `
  .brand,
  .stage-logo-official,
  .manifesto-logo{
    background-image:url('logo_Infotech.png') !important;
    background-repeat:no-repeat !important;
    background-position:left center !important;
    background-size:auto 100% !important;
    overflow:hidden !important;
    border-radius:50% !important;
  }

  .brand > img,
  .stage-logo-official > img,
  .manifesto-logo > img{
    opacity:0 !important;
    visibility:hidden !important;
    pointer-events:none !important;
  }

  .brand{
    width:62px !important;
    height:62px !important;
    flex:0 0 62px !important;
    background-color:#fff !important;
    box-shadow:0 10px 24px rgba(18,43,79,.12) !important;
    border:1px solid rgba(18,109,255,.09) !important;
  }

  .stage-logo-official{
    width:176px !important;
    height:176px !important;
    min-height:0 !important;
    padding:0 !important;
    background-color:#fff !important;
    box-shadow:0 20px 50px rgba(0,0,0,.18) !important;
  }

  .manifesto-logo{
    width:130px !important;
    height:130px !important;
    min-width:130px !important;
    padding:0 !important;
    background-color:#fff !important;
    box-shadow:0 18px 40px rgba(0,0,0,.18) !important;
  }

  .footer-brand{
    display:flex !important;
    align-items:center !important;
    gap:14px !important;
  }

  .footer-brand > img{
    width:72px !important;
    height:72px !important;
    flex:0 0 72px !important;
    border-radius:50% !important;
    object-fit:cover !important;
    object-position:left center !important;
    background:#fff !important;
    box-shadow:0 10px 24px rgba(18,43,79,.11) !important;
    border:1px solid rgba(18,109,255,.08) !important;
  }

  @media(max-width:920px){
    .brand{width:54px !important;height:54px !important;flex-basis:54px !important}
    .stage-logo-official{width:152px !important;height:152px !important}
    .manifesto-logo{width:116px !important;height:116px !important;min-width:116px !important}
  }

  @media(max-width:680px){
    .brand{width:48px !important;height:48px !important;flex-basis:48px !important}
    .stage-logo-official{width:126px !important;height:126px !important}
    .manifesto-logo{width:102px !important;height:102px !important;min-width:102px !important}
    .footer-brand > img{width:62px !important;height:62px !important;flex-basis:62px !important}
  }
`;
document.head.appendChild(logoFixStyle);

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
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const delay = Number(entry.target.dataset.delay || 0);
      window.setTimeout(() => entry.target.classList.add('is-visible'), delay);
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -35px 0px' });
  document.querySelectorAll('.reveal').forEach(element => revealObserver.observe(element));
} else {
  document.querySelectorAll('.reveal').forEach(element => element.classList.add('is-visible'));
}

if (!reducedMotion) {
  document.querySelectorAll('[data-tilt]').forEach(card => {
    const original = getComputedStyle(card).transform === 'none' ? '' : getComputedStyle(card).transform;
    card.addEventListener('pointermove', event => {
      if (window.innerWidth < 920) return;
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      const base = card.classList.contains('stage-main') ? 'rotate(-2.5deg)' : 'rotate(-2deg)';
      card.style.transform = `${base} perspective(1000px) rotateX(${y * -4}deg) rotateY(${x * 6}deg) translateY(-3px)`;
    });
    card.addEventListener('pointerleave', () => {
      card.style.transform = card.classList.contains('stage-main') ? 'rotate(-2.5deg)' : (original || 'rotate(-2deg)');
    });
  });

  document.querySelectorAll('.magnetic').forEach(button => {
    button.addEventListener('pointermove', event => {
      if (window.innerWidth < 920) return;
      const rect = button.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      button.style.transform = `translate(${x * 0.06}px, ${y * 0.08}px)`;
    });
    button.addEventListener('pointerleave', () => { button.style.transform = ''; });
  });
}

if (messageField && charCount) {
  const updateCount = () => { charCount.textContent = String(messageField.value.length); };
  messageField.addEventListener('input', updateCount);
  updateCount();
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

document.querySelectorAll('.faq-list details').forEach(item => {
  item.addEventListener('toggle', () => {
    if (!item.open) return;
    document.querySelectorAll('.faq-list details[open]').forEach(other => {
      if (other !== item) other.removeAttribute('open');
    });
  });
});

const sections = [...document.querySelectorAll('main section[id]')];
const navLinks = [...document.querySelectorAll('.nav a[href^="#"]')];
if ('IntersectionObserver' in window && sections.length) {
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
    });
  }, { rootMargin: '-35% 0px -55% 0px', threshold: 0 });
  sections.forEach(section => sectionObserver.observe(section));
}

const quoteSection = document.querySelector('#orcamento');
if (quoteSection && whatsappFloat && 'IntersectionObserver' in window) {
  const floatObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      whatsappFloat.style.opacity = entry.isIntersecting ? '0' : '1';
      whatsappFloat.style.pointerEvents = entry.isIntersecting ? 'none' : 'auto';
    });
  }, { threshold: 0.18 });
  floatObserver.observe(quoteSection);
}
