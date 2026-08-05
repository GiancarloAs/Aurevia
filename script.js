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

/* --- 3) Barra de progreso + número sincronizados (0% -> 20% -> 0%) --- */
(function animateProgress() {
  const bar = document.getElementById('progressBar');
  const label = document.getElementById('progressPercent');
  const track = document.getElementById('progressTrack');
  if (!bar || !label) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) {
    bar.style.width = '20%';
    label.textContent = '20%';
    if (track) track.setAttribute('aria-valuenow', '20');
    return;
  }

  const MAX = 20;               // porcentaje máximo del ciclo
  const HALF_DURATION = 1700;   // ms para ir de 0 a 20 (y lo mismo de vuelta)

  // easeInOutCubic — misma sensación que el cubic-bezier(0.65,0,0.35,1) anterior
  const ease = (t) => t < 0.5
    ? 4 * t * t * t
    : 1 - Math.pow(-2 * t + 2, 3) / 2;

  let start = null;

  function frame(timestamp) {
    if (start === null) start = timestamp;
    const elapsed = (timestamp - start) % (HALF_DURATION * 2);

    let progress; // 0 a 1 dentro del medio ciclo actual
    const goingUp = elapsed < HALF_DURATION;

    if (goingUp) {
      progress = elapsed / HALF_DURATION;
    } else {
      progress = 1 - (elapsed - HALF_DURATION) / HALF_DURATION;
    }

    const value = MAX * ease(progress);
    const rounded = Math.round(value);

    bar.style.width = value + '%';
    bar.style.opacity = (0.55 + (value / MAX) * 0.45).toFixed(2);
    label.textContent = rounded + '%';
    if (track) track.setAttribute('aria-valuenow', String(rounded));

    requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
})();
