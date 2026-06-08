function animateCounter(el, target, duration = 1800) {
  let start = null;
  function step(timestamp) {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target);
    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      el.textContent = target;
    }
  }
  requestAnimationFrame(step);
}

const statNums = document.querySelectorAll('.stat-num-big');
let countersStarted = false;

const counterObserver = new IntersectionObserver(entries => {
  if (entries[0].isIntersecting && !countersStarted) {
    countersStarted = true;
    statNums.forEach(el => {
      const raw = el.textContent.replace(/\D/g, '');
      const suffix = el.textContent.replace(/[\d]/g, '');
      const target = parseInt(raw, 10);
      if (!isNaN(target)) {
        animateCounter(el, target, 1800);
        setTimeout(() => {
          el.textContent = target + suffix;
        }, 1850);
      }
    });
  }
}, { threshold: 0.3 });

const statGrid = document.querySelector('.stat-grid');
if (statGrid) counterObserver.observe(statGrid);

document.querySelectorAll('.badge').forEach(badge => {
  badge.addEventListener('mouseenter', () => {
    badge.style.boxShadow = '0 0 12px rgba(0, 230, 118, 0.4)';
  });
  badge.addEventListener('mouseleave', () => {
    badge.style.boxShadow = '';
  });
});

document.addEventListener('DOMContentLoaded', () => {
  function initDragCards() {
    const cards = document.querySelectorAll('.drag-card');
    const container = document.querySelector('.reveal-cards');
    if (!cards.length || !container) return;
    let maxZ = 10;
    cards.forEach(card => {
      const leftPct = parseFloat(card.dataset.left);
      const topPct = parseFloat(card.dataset.top);
      card.style.left = leftPct + '%';
      card.style.top = topPct + '%';
      card.style.zIndex = maxZ++;
      let isDown = false, sx, sy, sl, st, lx, ly, lt;
      card.addEventListener('pointerdown', e => {
        // PREVENT DRAG ON X BUTTON
        if (e.target.closest('.win-close')) {
          return;
        }
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
      });
      card.addEventListener('pointermove', e => {
        if (!isDown) return;
        card.style.left = (sl + e.clientX - sx) + 'px';
        card.style.top = (st + e.clientY - sy) + 'px';
        lx = e.clientX; ly = e.clientY; lt = performance.now();
      });
      card.addEventListener('pointerup', e => {
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
            card.style.left = (br.left - cr.left + vx * 8) + 'px';
            card.style.top = (br.top - cr.top + vy * 8) + 'px';
            card.style.scale = '1';
            setTimeout(() => { card.style.transition = 'none'; }, 700);
          }
        }
      });
      card.addEventListener('pointercancel', () => {
        isDown = false;
        card.style.scale = '1';
        card.style.cursor = 'grab';
      });
    });
  }
  initDragCards();

  const folderGit = document.querySelector('.drag-card.is-square[data-left="55"][data-top="8"]');
  const modal = document.getElementById('github-modal');
  const streakClose = document.getElementById('github-streak-close');

  if (folderGit && modal) {
    folderGit.style.cursor = 'pointer';
    folderGit.addEventListener('click', () => {
      modal.style.display = '';
      modal.style.zIndex = 120;
    });
  }
  if (streakClose && modal) {
    streakClose.addEventListener('click', function (e) {
      modal.style.display = 'none';
      e.stopPropagation();
    });
  }
});
