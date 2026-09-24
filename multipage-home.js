(() => {
  'use strict';
  const nav = document.querySelector('#primary-nav');
  const items = [
    ['Início','/'],
    ['Serviços','/servicos/'],
    ['Sites','/sites/'],
    ['Atende IA','/atende-ia/'],
    ['Para negócios','/negocios/'],
    ['Sobre','/sobre/'],
    ['Contato','/contato/']
  ];

  if (nav) {
    while (nav.querySelectorAll(':scope > a').length < items.length) {
      nav.append(document.createElement('a'));
    }
    [...nav.querySelectorAll(':scope > a')].forEach((link, index) => {
      const item = items[index];
      if (!item) { link.remove(); return; }
      link.textContent = item[0];
      link.href = item[1];
      link.removeAttribute('aria-current');
      if (index === 0) link.setAttribute('aria-current','page');
      if (index === items.length - 1) link.classList.add('nav-cta');
      else link.classList.remove('nav-cta');
    });
  }

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

  // Produto próprio ganha destaque sem transformar a Home em outra landing page.
  if (!document.querySelector('.atende-home-callout')) {
    const anchor = document.querySelector('#negocios') || document.querySelector('.social-callout');
    if (anchor?.parentNode) {
      const section = document.createElement('section');
      section.className = 'atende-home-callout';
      section.setAttribute('aria-labelledby','atende-home-title');
      section.innerHTML = `
        <div class="container atende-home-grid">
          <div class="atende-home-copy reveal">
            <small>Produto Neri InfoTech</small>
            <h2 id="atende-home-title">Atendimento no WhatsApp com <span>IA e controle humano.</span></h2>
            <p>O Neri Atende IA reúne conversas, clientes, catálogo, agenda e conhecimento do negócio em uma plataforma própria. A IA apoia o atendimento e a equipe assume quando precisa.</p>
          </div>
          <div class="atende-home-actions reveal" data-delay="80">
            <div class="atende-home-points" aria-label="Principais recursos">
              <span><b>01</b>Conversas e atendimento humano</span>
              <span><b>02</b>Catálogo e clientes</span>
              <span><b>03</b>Agenda e conhecimento da IA</span>
              <span><b>04</b>WhatsApp e gestão por empresa</span>
            </div>
            <a class="button button-light" href="/atende-ia/">Conhecer o Neri Atende IA <span aria-hidden="true">↗</span></a>
          </div>
        </div>`;
      anchor.parentNode.insertBefore(section, anchor);

      // O script principal já criou o observer antes desta seção existir.
      section.querySelectorAll('.reveal').forEach(el => el.classList.add('is-visible'));
    }
  }

  document.querySelectorAll('.footer nav').forEach(footerNav => {
    const map = {'#servicos':'/servicos/','#valores':'/servicos/','#sites':'/sites/','#orcamento':'/contato/'};
    footerNav.querySelectorAll('a').forEach(link => {
      const raw = link.getAttribute('href');
      if (map[raw]) link.href = map[raw];
    });
    if (!footerNav.querySelector('a[href="/atende-ia/"]')) {
      const contact = footerNav.querySelector('a[href="/contato/"]');
      const link = document.createElement('a');
      link.href = '/atende-ia/';
      link.textContent = 'Atende IA';
      footerNav.insertBefore(link, contact || null);
    }
  });
})();
