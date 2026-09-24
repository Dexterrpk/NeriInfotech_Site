(() => {
  'use strict';
  const nav = document.querySelector('#primary-nav');
  const items = [
    ['Início','/'],
    ['Serviços','/servicos/'],
    ['Atende IA','/atende-ia/'],
    ['Sites','/sites/'],
    ['Para negócios','/negocios/'],
    ['Sobre','/sobre/'],
    ['Contato','/contato/']
  ];

  if (nav) {
    while (nav.querySelectorAll(':scope > a').length < items.length) nav.append(document.createElement('a'));
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

  // O SaaS aparece cedo como produto próprio, mas não substitui a proposta ampla da Neri InfoTech.
  const heroActions = document.querySelector('.hero-actions');
  if (heroActions && !document.querySelector('.hero-product-link')) {
    const product = document.createElement('a');
    product.className = 'hero-product-link';
    product.href = '/atende-ia/';
    product.innerHTML = '<span>Produto próprio</span><strong>Neri Atende IA</strong><small>Atendimento, catálogo e agenda com IA + controle humano</small><b>Conhecer →</b>';
    heroActions.insertAdjacentElement('afterend', product);
  }

  if (!document.querySelector('.atende-home-callout')) {
    // Logo após os serviços: produto próprio vira uma das frentes principais da marca.
    const anchor = document.querySelector('#valores') || document.querySelector('#sites') || document.querySelector('#negocios');
    if (anchor?.parentNode) {
      const section = document.createElement('section');
      section.className = 'atende-home-callout';
      section.setAttribute('aria-labelledby','atende-home-title');
      section.innerHTML = `
        <div class="container atende-home-grid">
          <div class="atende-home-copy reveal">
            <small>Neri Atende IA · software próprio</small>
            <h2 id="atende-home-title">Um produto para quem vende e atende <span>pelo WhatsApp todos os dias.</span></h2>
            <p>O Neri Atende IA reúne conversas, clientes, catálogo, agenda e conhecimento do negócio em uma única operação. A IA ajuda no repetitivo e a equipe assume quando o atendimento humano faz mais sentido.</p>
          </div>
          <div class="atende-home-actions reveal" data-delay="80">
            <div class="atende-home-points" aria-label="Principais benefícios do Neri Atende IA">
              <span><b>01</b>Informações do negócio no contexto do atendimento</span>
              <span><b>02</b>Catálogo, clientes e agenda organizados</span>
              <span><b>03</b>Recuperação de oportunidades nos planos compatíveis</span>
              <span><b>04</b>Planos atuais a partir de R$ 79/mês</span>
            </div>
            <a class="button button-light" href="/atende-ia/">Conhecer o Neri Atende IA <span aria-hidden="true">↗</span></a>
            <a class="atende-home-secondary" href="/contato/?servico=Neri%20Atende%20IA">Solicitar demonstração →</a>
          </div>
        </div>`;
      anchor.parentNode.insertBefore(section, anchor);
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
      const sites = footerNav.querySelector('a[href="/sites/"]');
      const link = document.createElement('a');
      link.href = '/atende-ia/';
      link.textContent = 'Atende IA';
      footerNav.insertBefore(link, sites || footerNav.firstChild);
    }
  });
})();
