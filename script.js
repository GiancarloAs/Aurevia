/* ============================================
   AUREVIA — Página en construcción
   1) Fallback elegante si assets/logo.png no existe aún
   2) Paralaje sutil del resplandor de fondo
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* --- 1) Fallback del logo --- */
  const logoImg = document.getElementById('logoImg');
  const logoPlaceholder = document.getElementById('logoPlaceholder');

  const showPlaceholder = () => {
    logoImg.style.display = 'none';
    logoPlaceholder.style.display = 'flex';
  };

  if (!logoImg.getAttribute('src')) {
    showPlaceholder();
  } else {
    logoImg.addEventListener('error', showPlaceholder);
    // Si la imagen ya estaba cacheada como rota antes de que el listener se añadiera
    if (logoImg.complete && logoImg.naturalWidth === 0) {
      showPlaceholder();
    }
  }

  /* --- 2) Paralaje sutil del resplandor (solo escritorio) --- */
  const glow = document.getElementById('glow');
  const isFinePointer = window.matchMedia('(pointer: fine)').matches;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (isFinePointer && !reduceMotion && glow) {
    let targetX = 0, targetY = 0, currentX = 0, currentY = 0;

    window.addEventListener('mousemove', (e) => {
      const nx = (e.clientX / window.innerWidth) - 0.5;
      const ny = (e.clientY / window.innerHeight) - 0.5;
      targetX = nx * 40; // rango de desplazamiento en px
      targetY = ny * 40;
    });

    const animateGlow = () => {
      currentX += (targetX - currentX) * 0.04;
      currentY += (targetY - currentY) * 0.04;
      glow.style.transform = `translate(calc(-50% + ${currentX}px), calc(-50% + ${currentY}px))`;
      requestAnimationFrame(animateGlow);
    };
    requestAnimationFrame(animateGlow);
  }

});
