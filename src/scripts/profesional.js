const revealEls = document.querySelectorAll('.prof-card');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, index * 120);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

revealEls.forEach(el => revealObserver.observe(el));

function handleProfSubmit(event) {
  event.preventDefault();
  const success = document.getElementById('profSuccess');
  if (success) {
    success.classList.add('visible');
    setTimeout(() => success.classList.remove('visible'), 5000);
  }
  event.target.reset();
  return false;
}