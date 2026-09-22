(() => {
  'use strict';

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(pointer: fine)').matches;

  // Copy refinada: reduz repetição e deixa a mensagem mais comercial sem inventar informações.
  const setText = (selector, text) => {
    const element = document.querySelector(selector);
    if (element) element.textContent = text;
  };
  const setHTML = (selector, html) => {
    const element = document.querySelector(selector);
    if (element) element.innerHTML = html;
  };

  setText('.hero-lead', 'Suporte técnico, upgrades, redes e sites para pessoas e pequenos negócios. Você explica o que precisa; eu avalio o cenário, apresento o caminho e o valor antes da execução.');

  const heroFacts = document.querySelectorAll('.hero-facts li');
  if (heroFacts[0]) heroFacts[0].innerHTML = '<strong>Direto</strong><span>Você fala com quem analisa e executa.</span>';
  if (heroFacts[1]) heroFacts[1].innerHTML = '<strong>Transparente</strong><span>Problema, solução e valor ficam claros antes.</span>';
  if (heroFacts[2]) heroFacts[2].innerHTML = '<strong>Prático</strong><span>Presencial quando precisa, remoto quando faz sentido.</span>';

  const stripItems = document.querySelectorAll('.strip-grid span');
  ['Atendimento local','Suporte remoto','Orçamento antes do serviço','Soluções sob medida','Santo Antônio de Jesus - BA'].forEach((text, index) => {
    if (stripItems[index]) stripItems[index].textContent = text;
  });

  setHTML('#services-title', 'Do computador ao site, <span>soluções que fazem sentido.</span>');
  setText('.services .section-head > p', 'Primeiro eu entendo o cenário. Depois, indico o caminho mais adequado — sem complicar e sem trocar o que ainda funciona.');
  const upgradeText = document.querySelector('.service-row:nth-of-type(2) p');
  if (upgradeText) upgradeText.textContent = 'SSD, memória RAM, compatibilidade, instalação e testes para ganhar desempenho sem trocar de máquina antes da hora.';

  setText('.prices-intro > p:not(.kicker)', 'Valores base para os serviços mais pedidos em Santo Antônio de Jesus. Quando o caso exige diagnóstico ou varia em complexidade, você sabe antes de autorizar.');

  setHTML('#sites-title', 'Presença digital feita para <span>o seu momento.</span>');
  setText('.site-head > p', 'Cada projeto parte do objetivo do negócio e da ação que o visitante precisa realizar. Visual, conteúdo e estrutura são pensados juntos.');
  const planDescriptions = document.querySelectorAll('.site-plan > p:not(.plan-price)');
  if (planDescriptions[0]) planDescriptions[0].textContent = 'Página enxuta e personalizada para reunir WhatsApp, Instagram, catálogo, localização e links importantes em uma experiência própria da sua marca.';
  if (planDescriptions[1]) planDescriptions[1].textContent = 'Página única para apresentar um serviço, produto ou campanha e conduzir o visitante para uma ação clara, como pedir orçamento ou chamar no WhatsApp.';
  if (planDescriptions[2]) planDescriptions[2].textContent = 'Estrutura mais completa para apresentar empresa, serviços, portfólio, dúvidas e contato com organização profissional e experiência responsiva.';

  setHTML('#business-title', 'Tecnologia organizada para <span>o negócio funcionar melhor.</span>');
  setText('.business-copy > p:not(.kicker)', 'Computadores, impressoras, rede e presença digital podem ser cuidados de forma simples e coordenada. Menos interrupção, mais continuidade no dia a dia.');

  setHTML('#process-title', 'Você entende o caminho <span>antes de decidir.</span>');
  setText('.process .section-head > p', 'Primeiro vem o contexto, depois a solução. O serviço só avança quando escopo e valor estão claros.');

  setText('#social-title', 'Conteúdo útil, bastidores e projetos.');
  setText('.social-grid > p', 'Manutenção, upgrades, sites e tecnologia aplicada ao dia a dia, com exemplos práticos e linguagem direta.');
  setText('.faq-intro > p:not(.kicker)', 'Se sua dúvida não estiver aqui, descreva o caso no formulário e continue a conversa pelo WhatsApp.');
  setText('#quote-title', 'Explique o que você precisa. A conversa continua no WhatsApp.');
  setText('.quote-copy > p:not(.kicker)', 'O formulário apenas monta a mensagem no seu aparelho; nada é armazenado neste site.');

  const footerCopy = document.querySelector('.footer-brand p');
  if (footerCopy) footerCopy.innerHTML = 'Tecnologia prática para pessoas e pequenos negócios.<br><span>Santo Antônio de Jesus - BA</span>';

  // Spotlight muito leve nos planos: reforça profundidade sem mover o conteúdo.
  if (finePointer && !reducedMotion) {
    document.querySelectorAll('.site-plan').forEach(plan => {
      plan.addEventListener('pointermove', event => {
        const rect = plan.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * 100;
        const y = ((event.clientY - rect.top) / rect.height) * 100;
        plan.style.setProperty('--spot-x', `${x.toFixed(1)}%`);
        plan.style.setProperty('--spot-y', `${y.toFixed(1)}%`);
      }, { passive: true });
      plan.addEventListener('pointerleave', () => {
        plan.style.removeProperty('--spot-x');
        plan.style.removeProperty('--spot-y');
      });
    });
  }

  // Pausa a faixa animada quando ela sai da viewport para poupar trabalho desnecessário.
  const strip = document.querySelector('.strip-grid');
  if (strip && 'IntersectionObserver' in window && !reducedMotion) {
    const stripObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        strip.style.animationPlayState = entry.isIntersecting ? 'running' : 'paused';
      });
    }, { threshold: 0.05 });
    stripObserver.observe(strip);
  }
})();
