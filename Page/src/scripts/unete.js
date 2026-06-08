// ── Form submit ────────────────────────────────────────────
function handleFormSubmit(e) {
  e.preventDefault();
  const btn     = e.target.querySelector('button[type="submit"]');
  const success = document.getElementById('formSuccess');

  btn.textContent = 'Enviando...';
  btn.disabled    = true;
  btn.style.opacity = '0.7';

  setTimeout(() => {
    e.target.reset();
    btn.textContent   = 'Enviar solicitud →';
    btn.disabled      = false;
    btn.style.opacity = '';
    success.classList.add('visible');
    setTimeout(() => success.classList.remove('visible'), 5000);
  }, 1400);
}

const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', handleFormSubmit);
}

// ── Reveal de perks con stagger ────────────────────────────
const perks = document.querySelectorAll('.contact-perks li');

const perkObserver = new IntersectionObserver(entries => {
  if (entries[0].isIntersecting) {
    perks.forEach((li, i) => {
      setTimeout(() => {
        li.style.opacity   = '1';
        li.style.transform = 'translateX(0)';
      }, i * 120);
    });
    perkObserver.disconnect();
  }
}, { threshold: 0.3 });

perks.forEach(li => {
  li.style.opacity   = '0';
  li.style.transform = 'translateX(-16px)';
  li.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
});

const perksList = document.querySelector('.contact-perks');
if (perksList) perkObserver.observe(perksList);