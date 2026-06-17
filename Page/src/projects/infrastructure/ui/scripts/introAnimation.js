export function initIntroAnimation() {
  return new Promise(resolve => {
    const section = document.getElementById('projects-mural');
    const cards = document.querySelectorAll('.project-card');

    if (!section || !cards.length) { resolve(); return; }

    const overlay = document.createElement('div');
    overlay.className = 'intro-overlay';

    const scanlines = document.createElement('div');
    scanlines.className = 'intro-scanlines';

    const titleWrap = document.createElement('div');
    titleWrap.className = 'intro-title';

    const scrambleBox = document.createElement('div');
    scrambleBox.className = 'scramble-text';
    scrambleBox.id = 'scramble-text';
    titleWrap.appendChild(scrambleBox);

    document.body.appendChild(scanlines);
    document.body.appendChild(overlay);
    document.body.appendChild(titleWrap);

    function minimalize(el) {
      el.querySelector('.card-body p')?.remove();
      el.querySelector('.card-tags')?.remove();
      el.querySelector('.card-link')?.remove();
      const img = el.querySelector('.card-img');
      if (img) img.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;overflow:hidden;';
      const imgEl = el.querySelector('img');
      if (imgEl) imgEl.style.cssText = 'width:100%;height:100%;object-fit:cover;display:block;';
      const body = el.querySelector('.card-body');
      if (body) body.style.cssText = 'position:absolute;bottom:0;left:0;right:0;padding:1px 3px;background:rgba(0,0,0,0.25);';
      const h3 = el.querySelector('h3');
      if (h3) h3.style.cssText = 'font-size:0.4rem;color:#f6f4f3;margin:0;line-height:1;opacity:0.7;';
    }

    const clones = [];
    function cloneCard(src) {
      const c = src.cloneNode(true);
      const all = c.querySelectorAll('*');
      [c, ...all].forEach(el => {
        Array.from(el.attributes).forEach(a => {
          if (a.name.startsWith('data-v-')) el.removeAttribute(a.name);
        });
      });
      c.className = 'intro-card';
      c.style.cssText = 'position:absolute;pointer-events:none;opacity:0;transform:none';
      return c;
    }

    for (let i = 0; i < 10; i++) {
      const c = cloneCard(cards[i]);
      minimalize(c);
      clones.push(c);
    }
    for (let i = 0; i < 5; i++) {
      const c = cloneCard(cards[i]);
      minimalize(c);
      clones.push(c);
    }
    clones.forEach(c => overlay.appendChild(c));

    /* ===================== FASE CARDS ===================== */
    requestAnimationFrame(() => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const cw = Math.min(340, vw * 0.37);
      const ch = Math.round(cw * 1.01);
      const cx = vw / 2;
      const cy = vh / 2;
      const total = clones.length;
      const interval = 100;
      const anchorX = cx - cw / 2;
      const anchorY = cy - ch / 2;
      let idx = 0;
      let done = false;

      clones.forEach((c, i) => {
        c.style.width = cw + 'px';
        c.style.height = ch + 'px';
        const angle = Math.PI + i * 0.45;
        const radius = 110 - i * 6;
        const ox = Math.cos(angle) * radius;
        const oy = Math.sin(angle) * radius;
        c.style.left = (anchorX + ox) + 'px';
        c.style.top = (anchorY + oy) + 'px';
        c.style.zIndex = i + 1;
      });

      function popNext() {
        if (done) return;
        clones[idx].classList.add('show');
        idx++;
        if (idx >= total) {
          done = true;
          setTimeout(fadeCards, 100);
          return;
        }
        setTimeout(popNext, interval);
      }

      function fadeCards() {
        clones.forEach(c => {
          c.style.transition = 'opacity 0.3s ease';
          c.style.opacity = '0';
        });
        setTimeout(showTitle, 300);
      }

      function showTitle() {
        overlay.style.transition = 'opacity 0.3s ease';
        overlay.style.opacity = '0';

        scanlines.classList.add('show', 'active');
        titleWrap.classList.add('show');
        scrambleTitle(() => {
          overlay.remove();
          scanlines.remove();
          titleWrap.remove();
          resolve();
        });
      }

      popNext();
    });

    /* ===================== FASE TITULO ===================== */
    function scrambleTitle(done) {
      const text = 'PROYECTOS ACM';
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*<>/?';
      const container = document.getElementById('scramble-text');
      const spans = [];

      for (let i = 0; i < text.length; i++) {
        const span = document.createElement('span');
        span.textContent = text[i] === ' ' ? '\u00A0' : chars[Math.floor(Math.random() * chars.length)];
        container.appendChild(span);
        spans.push(span);
      }

      let frame = 0;
      const scrambleInt = setInterval(() => {
        frame++;
        spans.forEach((span, i) => {
          if (text[i] === ' ' || span.dataset.locked) return;
          span.textContent = chars[Math.floor(Math.random() * chars.length)];
          span.style.transform = `translateY(${Math.sin(frame * 0.3 + i * 1.2) * 5}px)`;
          span.style.opacity = 0.3 + Math.random() * 0.7;
        });
      }, 40);

      let locked = 0;
      spans.forEach((span, i) => {
        const delay = 200 + i * 60;
        setTimeout(() => {
          if (text[i] === ' ') { locked++; return; }
          span.dataset.locked = 'true';
          span.textContent = text[i];
          span.style.transform = 'translateY(-8px)';
          span.style.opacity = '1';
          requestAnimationFrame(() => {
            span.style.transition = 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)';
            span.style.transform = 'translateY(0)';
          });
          locked++;
          if (locked === text.length) {
            clearInterval(scrambleInt);
            container.classList.add('complete');
            setTimeout(done, 800);
          }
        }, delay);
      });
    }
  });
}
