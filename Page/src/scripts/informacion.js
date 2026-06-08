const infoItems = document.querySelectorAll('.info-item');

const infoObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      infoObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

// Estado inicial: ocultos hacia abajo
infoItems.forEach((item, i) => {
  item.style.opacity = '0';
  item.style.transform = 'translateY(24px)';
  item.style.transition = `opacity 0.5s ease ${i * 0.08}s, transform 0.5s ease ${i * 0.08}s`;
  infoObserver.observe(item);
});