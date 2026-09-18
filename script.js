(() => {
  'use strict';

  const header = document.querySelector('.site-header');
  const progress = document.querySelector('.scroll-progress');
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav');
  const year = document.querySelector('#year');
  const quoteForm = document.querySelector('#quoteForm');
  const serviceField = document.querySelector('#servico');
  const messageField = document.querySelector('#mensagem');
  const charCount = document.querySelector('#charCount');
  const formStatus = document.querySelector('#formStatus');
  const whatsappFloat = document.querySelector('.whatsapp-float');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (year) year.textContent = String(new Date().getFullYear());

  const updateScrollUI = () => {
    const root = document.documentElement;
    const scrollable = root.scrollHeight - root.clientHeight;
    const percent = scrollable > 0 ? (root.scrollTop / scrollable) * 100 : 0;
    header?.classList.toggle('scrolled', window.scrollY > 18);
    if (progress) progress.style.width = `${Math.min(100, Math.max(0, percent))}%`;
  };

  const closeMenu = () => {
    nav?.classList.remove('open');
    menuToggle?.setAttribute('aria-expanded', 'false');
    menuToggle?.setAttribute('aria-label', 'Abrir menu');
    document.body.classList.remove('menu-open');
  };

  updateScrollUI();
  window.addEventListener('scroll', updateScrollUI, { passive: true });

  menuToggle?.addEventListener('click', () => {
    const open = !nav?.classList.contains('open');
    nav?.classList.toggle('open', open);
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    document.body.classList.toggle('menu-open', open);
  });

  document.querySelectorAll('.nav a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeMenu();
  });
  document.addEventListener('click', event => {
    if (!nav?.classList.contains('open')) return;
    if (!nav.contains(event.target) && !menuToggle?.contains(event.target)) closeMenu();
  });

  if (!reducedMotion && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const delay = Math.min(Number(entry.target.dataset.delay || 0), 250);
        window.setTimeout(() => entry.target.classList.add('is-visible'), delay);
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal').forEach(item => revealObserver.observe(item));
  } else {
    document.querySelectorAll('.reveal').forEach(item => item.classList.add('is-visible'));
  }

  const scrollToQuote = service => {
    if (serviceField) {
      const match = [...serviceField.options].find(option => option.text === service);
      if (match) serviceField.value = match.value || match.text;
    }
    document.querySelector('#orcamento')?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
    window.setTimeout(() => document.querySelector('#nome')?.focus({ preventScroll: true }), reducedMotion ? 0 : 550);
  };

  document.querySelectorAll('[data-service]').forEach(control => {
    control.addEventListener('click', () => scrollToQuote(control.dataset.service || ''));
  });

  if (messageField && charCount) {
    const updateCount = () => { charCount.textContent = String(messageField.value.length); };
    messageField.addEventListener('input', updateCount);
    updateCount();
  }

  quoteForm?.addEventListener('submit', event => {
    event.preventDefault();
    formStatus.textContent = '';

    if (!quoteForm.checkValidity()) {
      quoteForm.reportValidity();
      formStatus.textContent = 'Confira os campos obrigatórios antes de continuar.';
      return;
    }

    const data = new FormData(quoteForm);
    const nome = String(data.get('nome') || '').trim();
    const servico = String(data.get('servico') || '').trim();
    const mensagem = String(data.get('mensagem') || '').trim();

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
    formStatus.textContent = 'Abrindo o WhatsApp com sua mensagem...';
    window.location.href = url;
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
    }, { rootMargin: '-32% 0px -58% 0px', threshold: 0 });
    sections.forEach(section => sectionObserver.observe(section));
  }

  const quoteSection = document.querySelector('#orcamento');
  if (quoteSection && whatsappFloat && 'IntersectionObserver' in window) {
    const floatObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        whatsappFloat.style.opacity = entry.isIntersecting ? '0' : '1';
        whatsappFloat.style.pointerEvents = entry.isIntersecting ? 'none' : 'auto';
      });
    }, { threshold: 0.12 });
    floatObserver.observe(quoteSection);
  }
})();
