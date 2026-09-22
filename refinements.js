(() => {
  'use strict';

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(pointer: fine)').matches;

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
