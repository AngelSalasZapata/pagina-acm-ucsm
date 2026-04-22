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

// Dispara los contadores cuando las stat cards entran en pantalla
const statNums = document.querySelectorAll('.stat-num-big');
let countersStarted = false;

const counterObserver = new IntersectionObserver(entries => {
  if (entries[0].isIntersecting && !countersStarted) {
    countersStarted = true;
    statNums.forEach(el => {
      // Lee el número limpio del texto (ej: "120+" → 120)
      const raw = el.textContent.replace(/\D/g, '');
      const suffix = el.textContent.replace(/[\d]/g, ''); // guarda el "+" o "°"
      const target = parseInt(raw, 10);
      if (!isNaN(target)) {
        animateCounter(el, target, 1800);
        // Restaura el sufijo al terminar
        setTimeout(() => {
          el.textContent = target + suffix;
        }, 1850);
      }
    });
  }
}, { threshold: 0.3 });

const statGrid = document.querySelector('.stat-grid');
if (statGrid) counterObserver.observe(statGrid);

// ── Badge hover glow (opcional, efecto extra) ──────────────
document.querySelectorAll('.badge').forEach(badge => {
  badge.addEventListener('mouseenter', () => {
    badge.style.boxShadow = '0 0 12px rgba(0, 230, 118, 0.4)';
  });
  badge.addEventListener('mouseleave', () => {
    badge.style.boxShadow = '';
  });
});