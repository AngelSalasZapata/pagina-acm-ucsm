export function initReveal() {
  const introEl = document.getElementById('reveal-intro');
  const whiteEl = document.getElementById('reveal-white');
  const redEl = document.getElementById('reveal-red');
  const blueEl = document.getElementById('reveal-blue');
  const greenEl = document.getElementById('reveal-green');
  const purpleEl = document.getElementById('reveal-purple');
  const section = document.getElementById('scroll-reveal');
  if (!introEl || !whiteEl || !redEl || !blueEl || !greenEl || !purpleEl || !section) return;

  const STEPS = 7;
  const stairWidth = 8;
  const maxOffset = (STEPS - 1) * stairWidth;
  const total = 100 + maxOffset;

  const off1 = [];
  for (let i = 0; i < STEPS; i++) off1.push(i * stairWidth);
  for (let i = STEPS - 1; i >= 0; i--) off1.push(i * stairWidth);

  const off2 = [];
  for (let i = STEPS - 1; i >= 0; i--) off2.push(i * stairWidth);
  for (let i = 0; i < STEPS; i++) off2.push(i * stairWidth);

  const totalSteps = off1.length;
  const stepH = 100 / totalSteps;

  function poly1(p) {
    const sp = p * p * (3 - 2 * p);
    const pts = ['0% 0%'];
    for (let i = 0; i < totalSteps; i++) {
      const rx = Math.max(0, Math.min(100, sp * total - maxOffset + off1[i]));
      pts.push(`${rx}% ${i * stepH}%`, `${rx}% ${(i + 1) * stepH}%`);
    }
    pts.push('0% 100%');
    return `polygon(${pts.join(',')})`;
  }

  function polyStr(p, o) {
    const sp = p * p * (3 - 2 * p);
    const pts = ['0% 0%'];
    for (let i = 0; i < totalSteps; i++) {
      const rx = Math.max(0, Math.min(100, (1 - sp) * 100 - sp * maxOffset + o[i]));
      pts.push(`${rx}% ${i * stepH}%`, `${rx}% ${(i + 1) * stepH}%`);
    }
    pts.push('0% 100%');
    return `polygon(${pts.join(',')})`;
  }

  const sp = x => x * x * (3 - 2 * x);
  let ticking = false;

  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const rect = section.getBoundingClientRect();
      const wh = window.innerHeight;
      const totalScroll = rect.height + wh;
      const scrolled = wh - rect.top;
      const pt = Math.max(0, Math.min(1, scrolled / totalScroll));

      const split = 0.16;
      const p0 = 1 - Math.min(pt / split, 1);
      const p1 = Math.min(Math.max(pt - split, 0) / split, 1);
      const p2 = Math.min(Math.max(pt - split * 2, 0) / split, 1);
      const p3 = Math.min(Math.max(pt - split * 3, 0) / split, 1);
      const p4 = Math.min(Math.max(pt - split * 4, 0) / split, 1);
      const p5 = Math.min(Math.max(pt - split * 5, 0) / split, 1);

      introEl.style.opacity = p0;

      whiteEl.style.clipPath = p2 > 0 ? polyStr(p2, off2) : (p1 > 0 ? poly1(p1) : poly1(0));

      redEl.style.opacity = p2 > 0 ? sp(p2) : 0;
      redEl.style.clipPath = p3 > 0 ? polyStr(p3, off2) : 'none';

      blueEl.style.opacity = p3 > 0 ? sp(p3) : 0;
      blueEl.style.clipPath = p4 > 0 ? polyStr(p4, off2) : 'none';

      greenEl.style.opacity = p4 > 0 ? sp(p4) : 0;
      greenEl.style.clipPath = p5 > 0 ? polyStr(p5, off2) : 'none';

      purpleEl.style.opacity = p5 > 0 ? sp(p5) : 0;

      ticking = false;
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}
