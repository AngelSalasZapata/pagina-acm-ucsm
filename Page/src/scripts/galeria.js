const galItems  = document.querySelectorAll('.gitem');
const lightbox  = document.getElementById('lightbox');
const lbImg     = document.getElementById('lbImg');
const lbCaption = document.getElementById('lbCaption');
const lbClose   = document.getElementById('lbClose');
const lbPrev    = document.getElementById('lbPrev');
const lbNext    = document.getElementById('lbNext');

let currentIndex = 0;

const galData = Array.from(galItems).map(item => ({
  src:     item.querySelector('img').src,
  caption: item.querySelector('.gitem-overlay span')?.textContent || ''
}));

function openLightbox(index) {
  currentIndex  = index;
  lbImg.src     = galData[index].src;
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
  lbImg.src    = galData[currentIndex].src;
  lbCaption.textContent = galData[currentIndex].caption;
}

function showNext() {
  currentIndex = (currentIndex + 1) % galData.length;
  lbImg.src    = galData[currentIndex].src;
  lbCaption.textContent = galData[currentIndex].caption;
}

galItems.forEach((item, i) => {
  item.addEventListener('click', () => openLightbox(i));
});

lbClose.addEventListener('click', closeLightbox);
lbPrev.addEventListener('click', showPrev);
lbNext.addEventListener('click', showNext);

// Cierra al hacer clic fuera de la imagen
lightbox.addEventListener('click', e => {
  if (e.target === lightbox) closeLightbox();
});

// Navegación con teclado
document.addEventListener('keydown', e => {
  if (!lightbox.classList.contains('active')) return;
  if (e.key === 'Escape')      closeLightbox();
  if (e.key === 'ArrowLeft')   showPrev();
  if (e.key === 'ArrowRight')  showNext();
});

// ── Reveal de imágenes con fade ────────────────────────────
const gitemObserver = new IntersectionObserver(entries => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'scale(1)';
      }, i * 80);
      gitemObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

galItems.forEach(item => {
  item.style.opacity = '0';
  item.style.transform = 'scale(0.97)';
  item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  gitemObserver.observe(item);
});