export function generateSeparator() {
  const bar = document.getElementById('separator-bar');
  if (!bar) return;
  const char = '+\\\\+';
  const containerWidth = bar.parentElement.clientWidth;
  const charWidth = 40;
  const repeatCount = Math.ceil(containerWidth / charWidth) + 2;
  bar.textContent = new Array(repeatCount).fill(char).join('');
}

export function initDragCards() {
  const cards = document.querySelectorAll('.drag-card');
  const container = document.querySelector('.reveal-cards');
  if (!cards.length || !container) return;

  let maxZ = 10;

  cards.forEach(card => {
    let leftPct = parseFloat(card.dataset.left);
    let topPct = parseFloat(card.dataset.top);
    if (!card.classList.contains('github-streak-card') && !card.classList.contains('instagram-modal-card')) {
      leftPct += (Math.random() - 0.5) * 30;
      topPct += (Math.random() - 0.5) * 30;
      const cardW = card.offsetWidth / container.offsetWidth * 100;
      const cardH = card.offsetHeight / container.offsetHeight * 100;
      leftPct = Math.max(0, Math.min(100 - cardW, leftPct));
      topPct = Math.max(0, Math.min(100 - cardH, topPct));
      if (leftPct > 18 && leftPct < 72 && topPct > 15 && topPct < 72) {
        leftPct = leftPct < 45 ? 8 : 72;
      }
    }
    card.style.left = leftPct + '%';
    card.style.top = topPct + '%';
    card.style.zIndex = maxZ++;

    let isDown = false, sx, sy, sl, st, lx, ly, lt;

    const onDown = (e) => {
      if (e.target.closest('.win-close') || e.target.closest('.win-body img')) return;
      isDown = true;
      maxZ++;
      card.style.zIndex = maxZ;
      card.style.scale = '1.05';
      card.style.cursor = 'grabbing';
      card.setPointerCapture(e.pointerId);

      const cr = container.getBoundingClientRect();
      const br = card.getBoundingClientRect();
      sx = e.clientX; sy = e.clientY;
      sl = br.left - cr.left; st = br.top - cr.top;
      lx = e.clientX; ly = e.clientY; lt = performance.now();
    };

    const clampPos = (leftPx, topPx) => {
      const cr = container.getBoundingClientRect();
      const cw = card.offsetWidth;
      const ch = card.offsetHeight;
      return {
        left: Math.max(0, Math.min(cr.width - cw, leftPx)),
        top: Math.max(0, Math.min(cr.height - ch, topPx)),
      };
    };

    const onMove = (e) => {
      if (!isDown) return;
      const p = clampPos(sl + e.clientX - sx, st + e.clientY - sy);
      card.style.left = p.left + 'px';
      card.style.top = p.top + 'px';
      lx = e.clientX; ly = e.clientY; lt = performance.now();
    };

    const onUp = (e) => {
      if (!isDown) return;
      isDown = false;
      card.style.scale = '1';
      card.style.cursor = 'grab';

      const dt = performance.now() - lt;
      if (dt > 0 && dt < 80) {
        const vx = ((e.clientX - lx) / dt) * 16;
        const vy = ((e.clientY - ly) / dt) * 16;
        if (Math.sqrt(vx * vx + vy * vy) > 2) {
          const cr = container.getBoundingClientRect();
          const br = card.getBoundingClientRect();
          card.style.transition = 'left 0.6s cubic-bezier(.22,1,.36,1), top 0.6s cubic-bezier(.22,1,.36,1)';
          const fp = clampPos(br.left - cr.left + vx * 8, br.top - cr.top + vy * 8);
          card.style.left = fp.left + 'px';
          card.style.top = fp.top + 'px';
          card.style.scale = '1';
          setTimeout(() => { card.style.transition = 'none'; }, 700);
        }
      }
    };

    const onCancel = () => {
      isDown = false;
      card.style.scale = '1';
      card.style.cursor = 'grab';
    };

    card.addEventListener('pointerdown', onDown);
    card.addEventListener('pointermove', onMove);
    card.addEventListener('pointerup', onUp);
    card.addEventListener('pointercancel', onCancel);
  });
}

export function initPresidenteBorder() {
  document.querySelectorAll('.presidente-border-wrap').forEach(wrap => {
    const svg = wrap.querySelector('.presidente-border-svg');
    const rect = svg.querySelector('rect');
    const update = () => {
      const w = wrap.offsetWidth;
      const h = wrap.offsetHeight;
      if (!w || !h) return;
      svg.setAttribute('viewBox', `0 0 ${w + 12} ${h + 12}`);
      rect.setAttribute('x', '2');
      rect.setAttribute('y', '2');
      rect.setAttribute('width', w + 8);
      rect.setAttribute('height', h + 8);
    };
    update();
    new ResizeObserver(update).observe(wrap);
  });
}

export function initModals() {
  const showModal = (id, z) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.style.display = '';
    el.style.zIndex = z;
    const win = el.querySelector('.github-modal-window');
    if (win) {
      win.style.animation = 'none';
      void win.offsetHeight;
      win.style.animation = 'win-open 0.3s cubic-bezier(.34,1.56,.64,1) forwards';
    }
  };

  const folderGit = document.querySelector('.drag-card.is-square[data-left="55"][data-top="8"]');
  const gitModal = document.getElementById('github-modal');
  const gitClose = document.getElementById('github-streak-close');
  const gitImg = gitModal?.querySelector('.win-body img');
  if (folderGit && gitModal && gitClose) {
    folderGit.style.cursor = 'pointer';
    folderGit.addEventListener('click', () => {
      showModal('github-modal', 120);
      showModal('instagram-modal', 119);
    });
    gitClose.addEventListener('click', (e) => {
      gitModal.style.display = 'none';
      e.stopPropagation();
    });
    if (gitImg) {
      gitImg.addEventListener('click', () => {
        window.open('https://github.com/arelyX1/', '_blank');
      });
    }
  }

  const igClose = document.getElementById('instagram-modal-close');
  const igModal = document.getElementById('instagram-modal');
  if (igClose && igModal) {
    igClose.addEventListener('click', (e) => {
      igModal.style.display = 'none';
      e.stopPropagation();
    });
  }
}
