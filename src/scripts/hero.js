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

// ── Hero Canvas: Particle Network ─────────────────────────
const canvas = document.getElementById('heroCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas, { passive: true });

const PARTICLE_COUNT = 60;

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

    p.x += p.vx;
    p.y += p.vy;

    if (p.x < 0) p.x = canvas.width;
    if (p.x > canvas.width) p.x = 0;
    if (p.y < 0) p.y = canvas.height;
    if (p.y > canvas.height) p.y = 0;

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

    p.vx *= 0.998;
    p.vy *= 0.998;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(0, 230, 118, ${p.opacity})`;
    ctx.fill();

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