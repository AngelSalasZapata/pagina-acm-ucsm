function handleFormSubmit(e) {
  e.preventDefault();
  const btn     = e.target.querySelector('button[type="submit"]');
  const success = document.getElementById('formSuccess');
  const form    = e.target;

  btn.textContent = 'Enviando...';
  btn.disabled    = true;
  btn.style.opacity = '0.7';

  const name    = encodeURIComponent(form.name.value.trim());
  const email   = encodeURIComponent(form.email.value.trim());
  const message = encodeURIComponent(form.message.value.trim());
  const subject = encodeURIComponent(`Nuevo miembro: ${form.name.value.trim()}`);
  const body    = encodeURIComponent(
    `Nombre: ${form.name.value.trim()}\n` +
    `Correo: ${form.email.value.trim()}\n\n` +
    `${form.message.value.trim()}`
  );

  window.open(`mailto:acm@ucsm.edu.pe?subject=${subject}&body=${body}`, '_blank');

  form.reset();
  btn.textContent   = 'Enviar solicitud →';
  btn.disabled      = false;
  btn.style.opacity = '';
  success.classList.add('visible');
  setTimeout(() => success.classList.remove('visible'), 5000);
}

const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', handleFormSubmit);
}

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
