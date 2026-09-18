(() => {
  'use strict';

  const doc = document.documentElement;
  const body = document.body;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(pointer: fine)').matches;
  const smallViewport = window.matchMedia('(max-width: 720px)').matches;
  const lowMemory = typeof navigator.deviceMemory === 'number' && navigator.deviceMemory <= 4;
  const lowCpu = typeof navigator.hardwareConcurrency === 'number' && navigator.hardwareConcurrency <= 4;
  const performanceLow = reducedMotion || lowMemory || lowCpu;

  if (performanceLow) doc.classList.add('performance-low');

  const header = document.querySelector('.site-header');
  const progress = document.querySelector('.scroll-progress');
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav');
  const year = document.querySelector('#year');
  const quoteForm = document.querySelector('#quoteForm');
  const messageField = document.querySelector('#mensagem');
  const charCount = document.querySelector('#charCount');
  const serviceField = document.querySelector('#servico');
  const formStatus = document.querySelector('#formStatus');
  const quoteSection = document.querySelector('#orcamento');
  const whatsappFloat = document.querySelector('.whatsapp-float');

  if (year) year.textContent = String(new Date().getFullYear());

  const preloader = document.createElement('div');
  preloader.className = 'experience-preloader';
  preloader.setAttribute('aria-hidden', 'true');
  preloader.innerHTML = `
    <div class="experience-preloader-inner">
      <img src="brand-mark.webp" width="68" height="68" alt="">
      <div class="experience-preloader-copy"><span>Neri InfoTech</span><small>carregando experiência</small></div>
      <strong id="experienceCount">00</strong>
      <div class="experience-preloader-meter"><i id="experienceBar"></i></div>
    </div>`;
  body.prepend(preloader);
  body.classList.add('is-loading');

  const finishLoad = () => {
    body.classList.remove('is-loading');
    body.classList.add('is-ready');
    preloader.classList.add('is-hidden');
    window.setTimeout(() => preloader.remove(), 1050);
  };

  if (reducedMotion) {
    finishLoad();
  } else {
    const started = performance.now();
    const count = preloader.querySelector('#experienceCount');
    const bar = preloader.querySelector('#experienceBar');
    const duration = 760;
    const animateLoader = now => {
      const p = Math.min(1, (now - started) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      const value = Math.round(eased * 100);
      count.textContent = String(value).padStart(2, '0');
      bar.style.width = `${value}%`;
      if (p < 1) requestAnimationFrame(animateLoader);
      else window.setTimeout(finishLoad, 100);
    };
    requestAnimationFrame(animateLoader);
  }

  let scrollTicking = false;
  const updateScrollUI = () => {
    const y = window.scrollY;
    const max = Math.max(1, doc.scrollHeight - window.innerHeight);
    const pct = Math.min(100, Math.max(0, (y / max) * 100));
    header?.classList.toggle('scrolled', y > 28);
    progress?.style.setProperty('--progress', `${pct}%`);
    scrollTicking = false;
  };
  const requestScrollUpdate = () => {
    if (scrollTicking) return;
    scrollTicking = true;
    requestAnimationFrame(updateScrollUI);
  };
  updateScrollUI();
  window.addEventListener('scroll', requestScrollUpdate, { passive: true });

  const closeMenu = (restore = false) => {
    nav?.classList.remove('open');
    menuToggle?.setAttribute('aria-expanded', 'false');
    menuToggle?.setAttribute('aria-label', 'Abrir menu');
    body.classList.remove('menu-open');
    if (restore) menuToggle?.focus({ preventScroll: true });
  };
  menuToggle?.addEventListener('click', () => {
    const open = !nav?.classList.contains('open');
    nav?.classList.toggle('open', open);
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    body.classList.toggle('menu-open', open);
    if (open) window.setTimeout(() => nav?.querySelector('a')?.focus(), 360);
  });
  nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => closeMenu(false)));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && nav?.classList.contains('open')) closeMenu(true);
  });

  const revealElements = [...document.querySelectorAll('.reveal')];
  if (!reducedMotion && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const delay = Number(entry.target.dataset.delay || 0);
        window.setTimeout(() => entry.target.classList.add('is-visible'), delay);
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    revealElements.forEach(element => revealObserver.observe(element));
  } else {
    revealElements.forEach(element => element.classList.add('is-visible'));
  }

  if (finePointer && !reducedMotion) {
    const dot = document.createElement('div');
    const ring = document.createElement('div');
    dot.className = 'cursor-dot';
    ring.className = 'cursor-ring';
    ring.innerHTML = '<span>OPEN</span>';
    body.append(dot, ring);
    const ringText = ring.querySelector('span');
    let mx = innerWidth / 2, my = innerHeight / 2;
    let dx = mx, dy = my, rx = mx, ry = my;

    window.addEventListener('pointermove', event => {
      mx = event.clientX;
      my = event.clientY;
      body.classList.add('cursor-ready');
    }, { passive: true });

    const loopCursor = () => {
      dx += (mx - dx) * .34;
      dy += (my - dy) * .34;
      rx += (mx - rx) * .13;
      ry += (my - ry) * .13;
      dot.style.transform = `translate3d(${dx}px,${dy}px,0)`;
      ring.style.transform = `translate3d(${rx}px,${ry}px,0)`;
      requestAnimationFrame(loopCursor);
    };
    loopCursor();

    document.querySelectorAll('a,button,.price-line,.diagnostic-board,.site-plan').forEach(element => {
      element.addEventListener('pointerenter', () => {
        ring.classList.add('is-active');
        ringText.textContent = element.matches('.site-plan,.price-line') ? 'VIEW' : 'OPEN';
      });
      element.addEventListener('pointerleave', () => ring.classList.remove('is-active'));
    });
  }

  if (finePointer && !reducedMotion) {
    document.querySelectorAll('.btn,.button,.nav-cta,.whatsapp-float,.social-grid>a').forEach(element => {
      element.classList.add('magnetic');
      element.addEventListener('pointermove', event => {
        const rect = element.getBoundingClientRect();
        const x = event.clientX - rect.left - rect.width / 2;
        const y = event.clientY - rect.top - rect.height / 2;
        element.style.transform = `translate3d(${x * .07}px,${y * .09}px,0)`;
      });
      element.addEventListener('pointerleave', () => { element.style.transform = ''; });
    });
  }

  const hero = document.querySelector('.hero');
  if (hero && !performanceLow) {
    const canvas = document.createElement('canvas');
    canvas.className = 'hero-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    hero.prepend(canvas);
    const ctx = canvas.getContext('2d', { alpha: true });

    if (ctx) {
      let w = 0, h = 0, dpr = 1;
      let pointerX = .72, pointerY = .30;
      let particles = [];
      let visible = true;
      const particleCount = smallViewport ? 22 : 44;

      const resize = () => {
        const rect = hero.getBoundingClientRect();
        w = rect.width;
        h = rect.height;
        dpr = Math.min(devicePixelRatio || 1, 1.6);
        canvas.width = Math.max(1, Math.round(w * dpr));
        canvas.height = Math.max(1, Math.round(h * dpr));
        canvas.style.width = `${w}px`;
        canvas.style.height = `${h}px`;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        particles = Array.from({ length: particleCount }, (_, i) => ({
          x: Math.random() * w,
          y: Math.random() * h,
          r: .6 + Math.random() * 1.6,
          vx: (Math.random() - .5) * .12,
          vy: (Math.random() - .5) * .12,
          a: .12 + Math.random() * .34,
          phase: Math.random() * Math.PI * 2,
          accent: i % 8 === 0
        }));
      };

      hero.addEventListener('pointermove', event => {
        const rect = hero.getBoundingClientRect();
        pointerX = (event.clientX - rect.left) / rect.width;
        pointerY = (event.clientY - rect.top) / rect.height;
      }, { passive: true });

      const render = time => {
        if (!visible) { requestAnimationFrame(render); return; }
        ctx.clearRect(0, 0, w, h);
        const gx = w * pointerX, gy = h * pointerY;
        const gradient = ctx.createRadialGradient(gx, gy, 0, gx, gy, Math.max(w, h) * .42);
        gradient.addColorStop(0, 'rgba(45,126,255,.16)');
        gradient.addColorStop(.45, 'rgba(41,207,255,.05)');
        gradient.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, w, h);

        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          p.x += p.vx; p.y += p.vy;
          if (p.x < -10) p.x = w + 10; if (p.x > w + 10) p.x = -10;
          if (p.y < -10) p.y = h + 10; if (p.y > h + 10) p.y = -10;
          const pulse = .78 + Math.sin(time * .0008 + p.phase) * .22;
          ctx.beginPath(); ctx.arc(p.x, p.y, p.r * pulse, 0, Math.PI * 2);
          ctx.fillStyle = p.accent ? `rgba(70,218,255,${p.a})` : `rgba(180,205,235,${p.a * .68})`;
          ctx.fill();
          for (let j = i + 1; j < particles.length; j++) {
            const q = particles[j];
            const dist = Math.hypot(p.x - q.x, p.y - q.y);
            if (dist < 112) {
              ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y);
              ctx.strokeStyle = `rgba(111,167,224,${(1 - dist / 112) * .052})`;
              ctx.lineWidth = .6; ctx.stroke();
            }
          }
        }
        requestAnimationFrame(render);
      };

      new IntersectionObserver(entries => { visible = entries.some(e => e.isIntersecting); }).observe(hero);
      resize();
      window.addEventListener('resize', resize, { passive: true });
      requestAnimationFrame(render);
    }
  }

  const diagnostic = document.querySelector('.diagnostic-board');
  if (diagnostic && finePointer && !reducedMotion && !performanceLow) {
    let tx = -7, ty = 2, cx = -7, cy = 2;
    diagnostic.addEventListener('pointermove', event => {
      const rect = diagnostic.getBoundingClientRect();
      tx = ((event.clientX - rect.left) / rect.width - .5) * 12;
      ty = ((event.clientY - rect.top) / rect.height - .5) * -8;
    });
    diagnostic.addEventListener('pointerleave', () => { tx = -7; ty = 2; });
    const animateDiagnostic = () => {
      cx += (tx - cx) * .07; cy += (ty - cy) * .07;
      diagnostic.style.transform = `perspective(1200px) rotateY(${cx}deg) rotateX(${cy}deg)`;
      requestAnimationFrame(animateDiagnostic);
    };
    animateDiagnostic();
  }

  const servicesSection = document.querySelector('.services');
  const serviceRail = servicesSection?.querySelector('.service-rail');
  const servicesHead = servicesSection?.querySelector('.section-head');
  const serviceRows = [...(serviceRail?.querySelectorAll('.service-row') || [])];
  const tones = ['47,123,255','66,215,255','156,124,255','73,217,173','255,180,94','255,124,200'];
  const symbols = ['◎','↥','⌁','◉','◇','↗'];
  const metas = ['diagnóstico · formatação · limpeza','SSD · RAM · compatibilidade','Wi-Fi · roteador · impressoras','software · configuração · acesso','HD · SSD · arquivos · partições','bio · landing · institucional'];

  if (servicesSection && serviceRail && servicesHead && serviceRows.length) {
    const experience = document.createElement('div');
    experience.className = 'services-experience';
    const stage = document.createElement('div');
    stage.className = 'services-stage';
    stage.innerHTML = `<div class="services-stage-head"><span>01</span><small>ÁREA ATIVA</small></div><div class="services-stage-visual"><div class="services-stage-grid"></div><div class="services-stage-orbit"></div><div class="services-stage-symbol">◎</div></div><div class="services-stage-copy"><small>Neri InfoTech</small><strong>Assistência técnica</strong><span>diagnóstico · formatação · limpeza</span></div>`;
    servicesSection.querySelector('.container').insertBefore(experience, servicesHead);
    experience.append(stage);
    const content = document.createElement('div');
    content.className = 'services-content';
    experience.append(content);
    content.append(servicesHead, serviceRail);

    const stageVisual = stage.querySelector('.services-stage-visual');
    const stageNumber = stage.querySelector('.services-stage-head span');
    const stageSymbol = stage.querySelector('.services-stage-symbol');
    const stageTitle = stage.querySelector('.services-stage-copy strong');
    const stageMeta = stage.querySelector('.services-stage-copy span');

    const activateRow = row => {
      serviceRows.forEach(item => item.classList.toggle('is-active', item === row));
      const index = serviceRows.indexOf(row);
      const title = row.querySelector('h3')?.textContent?.trim() || '';
      stageNumber.textContent = String(index + 1).padStart(2, '0');
      stageSymbol.textContent = symbols[index] || '◎';
      stageTitle.textContent = title;
      stageMeta.textContent = metas[index] || '';
      stageVisual.style.setProperty('--tone', tones[index] || tones[0]);
    };
    activateRow(serviceRows[0]);

    if ('IntersectionObserver' in window && window.innerWidth > 880) {
      const observer = new IntersectionObserver(entries => {
        const active = entries.filter(e => e.isIntersecting).sort((a,b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (active) activateRow(active.target);
      }, { threshold:[.2,.45,.7], rootMargin:'-20% 0px -25% 0px' });
      serviceRows.forEach(row => observer.observe(row));
    } else serviceRows.forEach(row => row.classList.add('is-active'));
  }

  const processSection = document.querySelector('.process');
  const processHead = processSection?.querySelector('.section-head');
  const processSteps = [...(processSection?.querySelectorAll('.process-list li') || [])];
  if (processSteps.length && 'IntersectionObserver' in window) {
    const processObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        processSteps.forEach(step => step.classList.toggle('is-active', step === entry.target));
        const index = processSteps.indexOf(entry.target) + 1;
        processHead?.style.setProperty('--process', `${(index / processSteps.length) * 100}%`);
      });
    }, { threshold:.55 });
    processSteps.forEach(step => processObserver.observe(step));
  } else processSteps.forEach(step => step.classList.add('is-active'));

  const normalize = value => String(value || '').trim().toLocaleLowerCase('pt-BR');
  const chooseService = service => {
    if (serviceField) {
      const option = [...serviceField.options].find(item => normalize(item.textContent) === normalize(service));
      if (option) serviceField.value = option.value || option.textContent;
    }
    quoteSection?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block:'start' });
    window.setTimeout(() => messageField?.focus({ preventScroll:true }), reducedMotion ? 0 : 620);
  };

  document.querySelectorAll('[data-service]').forEach(control => {
    control.addEventListener('click', () => chooseService(control.dataset.service));
  });
  document.querySelectorAll('.price-line').forEach(line => {
    line.setAttribute('role','button');
    line.setAttribute('tabindex','0');
    const service = line.querySelector('strong')?.textContent?.trim();
    const activate = () => service && chooseService(service.replace('SSD + Formatação','Instalação SSD + Formatação'));
    line.addEventListener('click', activate);
    line.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); activate(); } });
  });

  const updateCount = () => { if (messageField && charCount) charCount.textContent = String(messageField.value.length); };
  messageField?.addEventListener('input', updateCount);
  updateCount();

  const setStatus = message => { if (formStatus) formStatus.textContent = message; };
  quoteForm?.addEventListener('submit', event => {
    event.preventDefault();
    setStatus('');
    const data = new FormData(quoteForm);
    const nome = String(data.get('nome') || '').trim();
    const servico = String(data.get('servico') || '').trim();
    const mensagem = String(data.get('mensagem') || '').trim();
    if (!nome || !servico || !mensagem) {
      setStatus('Preencha nome, serviço e detalhes antes de continuar.');
      const invalid = [...quoteForm.elements].find(el => el instanceof HTMLElement && 'value' in el && !String(el.value).trim());
      invalid?.focus();
      return;
    }
    const text = ['Olá! Vi o site da Neri InfoTech e gostaria de solicitar um orçamento.','',`Nome: ${nome}`,`Serviço: ${servico}`,'','Detalhes:',mensagem].join('\n');
    const url = `https://wa.me/5575999294419?text=${encodeURIComponent(text)}`;
    const opened = window.open(url, '_blank', 'noopener,noreferrer');
    if (!opened) window.location.assign(url);
  });

  document.querySelectorAll('.faq-list details').forEach(detail => {
    detail.addEventListener('toggle', () => {
      if (!detail.open) return;
      document.querySelectorAll('.faq-list details[open]').forEach(other => { if (other !== detail) other.removeAttribute('open'); });
    });
  });

  if (quoteSection && whatsappFloat && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      const visible = entries.some(entry => entry.isIntersecting);
      whatsappFloat.style.opacity = visible ? '0' : '1';
      whatsappFloat.style.pointerEvents = visible ? 'none' : 'auto';
    }, { threshold:.14 });
    observer.observe(quoteSection);
  }
})();
