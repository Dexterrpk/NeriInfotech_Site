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

  // Uma arquitetura única em todas as páginas: serviços, produto próprio e presença digital.
  const navItems = [
    ['Início','/'],
    ['Serviços','/servicos/'],
    ['Atende IA','/atende-ia/'],
    ['Sites','/sites/'],
    ['Para negócios','/negocios/'],
    ['Sobre','/sobre/'],
    ['Contato','/contato/']
  ];
  if (nav) {
    while (nav.querySelectorAll(':scope > a').length < navItems.length) nav.append(document.createElement('a'));
    [...nav.querySelectorAll(':scope > a')].forEach((link, index) => {
      const item = navItems[index];
      if (!item) { link.remove(); return; }
      link.textContent = item[0];
      link.href = item[1];
      link.classList.toggle('nav-cta', index === navItems.length - 1);
      const url = new URL(link.href, location.href);
      const current = url.pathname !== '/' ? location.pathname.startsWith(url.pathname) : location.pathname === '/';
      if (current) link.setAttribute('aria-current','page');
      else link.removeAttribute('aria-current');
    });
  }

  document.querySelectorAll('.footer nav').forEach(footerNav => {
    if (!footerNav.querySelector('a[href="/atende-ia/"]')) {
      const sites = footerNav.querySelector('a[href="/sites/"]');
      const link = document.createElement('a');
      link.href = '/atende-ia/';
      link.textContent = 'Atende IA';
      footerNav.insertBefore(link, sites || footerNav.firstChild);
    }
  });

  const curtain = document.createElement('div');
  curtain.className = 'page-curtain';
  curtain.setAttribute('aria-hidden','true');
  body.append(curtain);
  addEventListener('pageshow', () => body.classList.remove('is-leaving'));

  let scrollPending = false;
  const updateScroll = () => {
    const max = Math.max(1, doc.scrollHeight - innerHeight);
    const pct = Math.min(100, Math.max(0, scrollY / max * 100));
    progress?.style.setProperty('--progress', `${pct}%`);
    header?.classList.toggle('scrolled', scrollY > 24);
    scrollPending = false;
  };
  const requestScrollUpdate = () => {
    if (scrollPending) return;
    scrollPending = true;
    requestAnimationFrame(updateScroll);
  };
  updateScroll();
  addEventListener('scroll', requestScrollUpdate, {passive:true});

  let previousFocus = null;
  const closeMenu = (restoreFocus = false) => {
    nav?.classList.remove('open');
    toggle?.setAttribute('aria-expanded','false');
    toggle?.setAttribute('aria-label','Abrir menu');
    body.classList.remove('menu-open');
    if (restoreFocus && previousFocus instanceof HTMLElement) previousFocus.focus({preventScroll:true});
  };
  toggle?.addEventListener('click', () => {
    const open = !nav?.classList.contains('open');
    if (open) previousFocus = document.activeElement;
    nav?.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    body.classList.toggle('menu-open', open);
    if (open) setTimeout(() => nav?.querySelector('a')?.focus(), 250);
  });
  nav?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => closeMenu(false)));
  addEventListener('keydown', e => {
    if (e.key === 'Escape' && nav?.classList.contains('open')) closeMenu(true);
    if (e.key !== 'Tab' || !nav?.classList.contains('open')) return;
    const focusable = [toggle, ...(nav?.querySelectorAll('a') || [])].filter(Boolean);
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });

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
      if (url.origin !== location.origin || (url.pathname === location.pathname && url.search === location.search && !url.hash)) return;
      if (url.pathname === location.pathname && url.hash) return;
      e.preventDefault();
      body.classList.add('is-leaving');
      setTimeout(() => { location.href = url.href; }, 300);
    });
  });

  const serviceField = document.querySelector('#servico');
  if (serviceField && ![...serviceField.options].some(o => o.value === 'Neri Atende IA' || o.textContent.trim() === 'Neri Atende IA')) {
    const option = new Option('Neri Atende IA', 'Neri Atende IA');
    const other = [...serviceField.options].find(o => o.textContent.trim() === 'Outro');
    serviceField.add(option, other || null);
  }
  const queryService = new URLSearchParams(location.search).get('servico');
  if (serviceField && queryService) {
    let option = [...serviceField.options].find(o => o.value === queryService || o.textContent.trim() === queryService);
    if (!option && queryService.length <= 80) {
      option = new Option(queryService, queryService);
      serviceField.add(option, 1);
    }
    if (option) serviceField.value = option.value || option.textContent.trim();
  }

  const form = document.querySelector('#quoteForm');
  const msg = document.querySelector('#mensagem');
  const count = document.querySelector('#charCount');
  const status = document.querySelector('#formStatus');
  if (msg && count) {
    count.textContent = String(msg.value.length);
    msg.addEventListener('input', () => count.textContent = String(msg.value.length));
  }
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
