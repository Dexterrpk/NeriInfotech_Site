(() => {
  'use strict';
  const navLinks = [...document.querySelectorAll('#primary-nav > a')];
  const items = [
    ['Início','/'],
    ['Serviços','/servicos/'],
    ['Sites','/sites/'],
    ['Para negócios','/negocios/'],
    ['Sobre','/sobre/'],
    ['Contato','/contato/']
  ];
  navLinks.forEach((link, index) => {
    if (!items[index]) return;
    link.textContent = items[index][0];
    link.href = items[index][1];
    if (index === items.length - 1) link.classList.add('nav-cta');
    else link.classList.remove('nav-cta');
  });

  const setHref = (selector, href, text) => {
    const el = document.querySelector(selector);
    if (!el) return;
    el.href = href;
    if (text) el.textContent = text;
  };
  setHref('.hero-actions .button-quiet','/servicos/','Ver serviços e valores');
  setHref('.service-row-highlight .text-action','/sites/');
  setHref('.prices-intro .button','/servicos/','Ver todos os serviços');
  setHref('.business-copy .button','/negocios/','Ver soluções para negócios');

  document.querySelectorAll('.footer nav a').forEach(link => {
    const map = {
      '#servicos':'/servicos/',
      '#valores':'/servicos/',
      '#sites':'/sites/',
      '#orcamento':'/contato/'
    };
    const raw = link.getAttribute('href');
    if (map[raw]) link.href = map[raw];
  });
})();
