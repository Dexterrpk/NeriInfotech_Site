(() => {
  'use strict';
  const body = document.body;
  const doc = document.documentElement;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(pointer:fine)').matches;
  const header = document.querySelector('.site-header');
  const nav = document.querySelector('.nav');
  const toggle = document.querySelector('.menu-toggle');
  const progress = document.querySelector('.page-progress');
  const year = document.querySelector('#year');
  if (year) year.textContent = String(new Date().getFullYear());

  const curtain = document.createElement('div');
  curtain.className = 'page-curtain';
  curtain.setAttribute('aria-hidden','true');
  body.append(curtain);

  const updateScroll = () => {
    const max = Math.max(1, doc.scrollHeight - innerHeight);
    const pct = Math.min(100, Math.max(0, scrollY / max * 100));
    progress?.style.setProperty('--progress', `${pct}%`);
    header?.classList.toggle('scrolled', scrollY > 24);
  };
  updateScroll();
  addEventListener('scroll', updateScroll, {passive:true});

  const closeMenu = () => {
    nav?.classList.remove('open');
    toggle?.setAttribute('aria-expanded','false');
    toggle?.setAttribute('aria-label','Abrir menu');
    body.classList.remove('menu-open');
  };
  toggle?.addEventListener('click', () => {
    const open = !nav?.classList.contains('open');
    nav?.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    body.classList.toggle('menu-open', open);
    if (open) setTimeout(() => nav?.querySelector('a')?.focus(), 250);
  });
  nav?.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });

  const reveals = document.querySelectorAll('.page-reveal');
  if (!reduced && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      io.unobserve(entry.target);
    }), {threshold:.12, rootMargin:'0px 0px -7% 0px'});
    reveals.forEach(el => io.observe(el));
  } else reveals.forEach(el => el.classList.add('is-visible'));

  if (fine && !reduced) {
    document.querySelectorAll('.button,.page-band a,.editorial-meta a,.contact-links a').forEach(el => {
      el.addEventListener('pointermove', e => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - r.left - r.width/2;
        const y = e.clientY - r.top - r.height/2;
        el.style.transform = `translate3d(${x*.035}px,${y*.05}px,0)`;
      });
      el.addEventListener('pointerleave', () => el.style.transform = '');
    });
  }

  document.querySelectorAll('a[href^="/"]').forEach(link => {
    link.addEventListener('click', e => {
      if (reduced || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || link.target === '_blank') return;
      const url = new URL(link.href, location.href);
      if (url.origin !== location.origin || url.pathname === location.pathname) return;
      e.preventDefault();
      body.classList.add('is-leaving');
      setTimeout(() => { location.href = url.href; }, 300);
    });
  });

  const serviceField = document.querySelector('#servico');
  const queryService = new URLSearchParams(location.search).get('servico');
  if (serviceField && queryService) {
    const option = [...serviceField.options].find(o => o.value === queryService || o.textContent.trim() === queryService);
    if (option) serviceField.value = option.value || option.textContent.trim();
  }

  const form = document.querySelector('#quoteForm');
  const msg = document.querySelector('#mensagem');
  const count = document.querySelector('#charCount');
  const status = document.querySelector('#formStatus');
  if (msg && count) msg.addEventListener('input', () => count.textContent = String(msg.value.length));
  form?.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.querySelector('#nome')?.value.trim() || '';
    const service = serviceField?.value.trim() || '';
    const text = msg?.value.trim() || '';
    if (!name || !service || !text) {
      if (status) status.textContent = 'Preencha nome, serviço e mensagem para continuar.';
      return;
    }
    if (status) status.textContent = '';
    const message = `Olá! Meu nome é ${name}.\n\nTenho interesse em: ${service}.\n\n${text}\n\nEnviei esta mensagem pelo site da Neri InfoTech.`;
    window.open(`https://wa.me/5575999294419?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
  });
})();
