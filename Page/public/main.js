/* =============================================
   ACM STUDENT CHAPTER — main.js
   ============================================= */

// ─── TERMINAL TYPED TEXT ─────────────────────
function typeText(el, text, speed, delay, onDone) {
  setTimeout(() => {
    let i = 0;
    el.innerHTML = '';
    const cursor = document.createElement('span');
    cursor.className = 'terminal-cursor';
    el.appendChild(cursor);
    const iv = setInterval(() => {
      el.insertBefore(document.createTextNode(text[i]), cursor);
      i++;
      if (i >= text.length) {
        clearInterval(iv);
        cursor.remove();
        if (onDone) onDone();
      }
    }, speed);
  }, delay);
}

const tline1 = document.getElementById('tline1');
const tline2 = document.getElementById('tline2');

if (tline1 && tline2) {
  typeText(tline1, '> inicializando ACM Student Chapter...', 38, 300, () => {
    typeText(tline2, '> sistema listo. bienvenido.', 38, 200);
  });
}

// ─── NAVBAR SCROLL ───────────────────────────

const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});

// ─── HAMBURGER MENU ──────────────────────────
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  const spans = hamburger.querySelectorAll('span');
  if (navLinks.classList.contains('open')) {
    spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
  } else {
    spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  }
});

navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    const spans = hamburger.querySelectorAll('span');
    spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  });
});

// ─── HERO CANVAS: PARTICLE NETWORK ───────────
const canvas = document.getElementById('heroCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const PARTICLE_COUNT = 60;
const GREEN = '#00e676';
const GREEN_DIM = 'rgba(0, 230, 118, 0.15)';

const particles = Array.from({ length: PARTICLE_COUNT }, () => ({
  x: Math.random() * canvas.width,
  y: Math.random() * canvas.height,
  vx: (Math.random() - 0.5) * 0.4,
  vy: (Math.random() - 0.5) * 0.4,
  r: Math.random() * 2 + 1,
  opacity: Math.random() * 0.5 + 0.1
}));

let mouseX = -999, mouseY = -999;
canvas.addEventListener('mousemove', e => {
  const rect = canvas.getBoundingClientRect();
  mouseX = e.clientX - rect.left;
  mouseY = e.clientY - rect.top;
});

function drawParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];

    // Move
    p.x += p.vx;
    p.y += p.vy;

    // Wrap
    if (p.x < 0) p.x = canvas.width;
    if (p.x > canvas.width) p.x = 0;
    if (p.y < 0) p.y = canvas.height;
    if (p.y > canvas.height) p.y = 0;

    // Mouse repulsion
    const dx = p.x - mouseX;
    const dy = p.y - mouseY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 100) {
      const force = (100 - dist) / 100 * 0.8;
      p.vx += (dx / dist) * force;
      p.vy += (dy / dist) * force;
      const maxV = 2;
      p.vx = Math.max(-maxV, Math.min(maxV, p.vx));
      p.vy = Math.max(-maxV, Math.min(maxV, p.vy));
    }

    // Damping
    p.vx *= 0.998;
    p.vy *= 0.998;

    // Draw dot
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(0, 230, 118, ${p.opacity})`;
    ctx.fill();

    // Connect to nearby
    for (let j = i + 1; j < particles.length; j++) {
      const q = particles[j];
      const qx = p.x - q.x;
      const qy = p.y - q.y;
      const d = Math.sqrt(qx * qx + qy * qy);
      if (d < 120) {
        const alpha = (1 - d / 120) * 0.15;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(q.x, q.y);
        ctx.strokeStyle = `rgba(0, 230, 118, ${alpha})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }
  }

  requestAnimationFrame(drawParticles);
}

drawParticles();

// ─── ANIMATED COUNTERS ────────────────────────
function animateCounter(el, target, duration = 1800) {
  let start = null;
  function step(timestamp) {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target;
  }
  requestAnimationFrame(step);
}

// Trigger counters when hero is visible
const counterEls = document.querySelectorAll('.stat-num');
let countersStarted = false;

const heroObserver = new IntersectionObserver(entries => {
  if (entries[0].isIntersecting && !countersStarted) {
    countersStarted = true;
    counterEls.forEach(el => {
      animateCounter(el, parseInt(el.dataset.target));
    });
  }
}, { threshold: 0.3 });

heroObserver.observe(document.getElementById('hero'));

// ─── SCROLL REVEAL (events) ──────────────────
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, i * 100);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

revealEls.forEach(el => revealObserver.observe(el));

// ─── GALLERY LIGHTBOX ────────────────────────
const galItems = document.querySelectorAll('.gitem');
const lightbox = document.getElementById('lightbox');
const lbImg = document.getElementById('lbImg');
const lbCaption = document.getElementById('lbCaption');
const lbClose = document.getElementById('lbClose');
const lbPrev = document.getElementById('lbPrev');
const lbNext = document.getElementById('lbNext');

let currentIndex = 0;
const galData = Array.from(galItems).map(item => ({
  src: item.querySelector('img').src,
  caption: item.querySelector('.gitem-overlay span')?.textContent || ''
}));

function openLightbox(index) {
  currentIndex = index;
  lbImg.src = galData[index].src;
  lbCaption.textContent = galData[index].caption;
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
}

function showPrev() {
  currentIndex = (currentIndex - 1 + galData.length) % galData.length;
  lbImg.src = galData[currentIndex].src;
  lbCaption.textContent = galData[currentIndex].caption;
}

function showNext() {
  currentIndex = (currentIndex + 1) % galData.length;
  lbImg.src = galData[currentIndex].src;
  lbCaption.textContent = galData[currentIndex].caption;
}

galItems.forEach((item, i) => {
  item.addEventListener('click', () => openLightbox(i));
});

lbClose.addEventListener('click', closeLightbox);
lbPrev.addEventListener('click', showPrev);
lbNext.addEventListener('click', showNext);

lightbox.addEventListener('click', e => {
  if (e.target === lightbox) closeLightbox();
});

document.addEventListener('keydown', e => {
  if (!lightbox.classList.contains('active')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') showPrev();
  if (e.key === 'ArrowRight') showNext();
});

// ─── FORM SUBMIT ─────────────────────────────
function handleFormSubmit(e) {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  const success = document.getElementById('formSuccess');

  btn.textContent = 'Enviando...';
  btn.disabled = true;
  btn.style.opacity = '0.7';

  setTimeout(() => {
    e.target.reset();
    btn.textContent = 'Enviar solicitud →';
    btn.disabled = false;
    btn.style.opacity = '';
    success.classList.add('visible');
    setTimeout(() => success.classList.remove('visible'), 5000);
  }, 1400);
}

// ─── SMOOTH ACTIVE NAV ───────────────────────
const sections = document.querySelectorAll('section[id]');
const navAnchorLinks = document.querySelectorAll('.nav-links a');

const activeObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navAnchorLinks.forEach(a => {
        a.style.color = '';
        if (a.getAttribute('href') === `#${entry.target.id}`) {
          a.style.color = '#00e676';
        }
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => activeObserver.observe(s));