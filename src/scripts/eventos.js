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

// ── Highlight del tag según tipo de evento ─────────────────
const tagColors = {
  'Hackathon': '#ff6b35',
  'Taller':    '#00e676',
  'Keynote':   '#64b5f6',
  'Workshop':  '#ce93d8',
  'Networking':'#ffcc02',
};

document.querySelectorAll('.event-tag').forEach(tag => {
  const color = tagColors[tag.textContent.trim()];
  if (color) {
    tag.style.background = color;
    // Ajusta el color del texto para legibilidad
    tag.style.color = color === '#00e676' ? '#080d08' : '#080d08';
  }
});