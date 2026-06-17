import { kernels, systemdServices } from '../../../application/boot';

const bootScreen = document.getElementById('boot-screen');
const bootOutput = document.getElementById('boot-output');
const hero = document.querySelector('.hero');
if (hero) hero.style.opacity = '0';

if (bootScreen && bootOutput) {
  const now = new Date();
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const month = months[now.getMonth()];
  const day = String(now.getDate()).padStart(2, '0');
  function ts(sec) {
    const d = new Date(now);
    d.setSeconds(d.getSeconds() - 20 + sec);
    const hh = String(d.getHours()).padStart(2, '0');
    const mm = String(d.getMinutes()).padStart(2, '0');
    const ss = String(d.getSeconds()).padStart(2, '0');
    return `${month} ${day} ${hh}:${mm}:${ss}`;
  }

  const bootLines = [];
  const pid = () => Math.floor(Math.random() * 9999) + 1;
  const pick = arr => arr[Math.floor(Math.random() * arr.length)];

  let sec = 0;
  const lineCount = 60;

  for (let i = 0; i < lineCount; i++) {
    const t = ts(sec);
    if (i < 50) {
      bootLines.push(`${t} ACM sys kernel: ${pick(kernels)}`);
    } else {
      const svc = pick(systemdServices);
      const svcName = svc[0];
      const msgs = svc[2];
      bootLines.push(`${t} ACM sys ${svcName}[${pid()}]: ${pick(msgs)}`);
    }
    sec += 0.066;
  }

  const blinkStyle = document.createElement('style');
  blinkStyle.textContent = `
    @keyframes boot-blink { 0%,100% { opacity:1 } 50% { opacity:0 } }
  `;
  document.head.appendChild(blinkStyle);

  let idx = 0;
  const batchSize = 2;

  function showBatch() {
    const fragment = document.createDocumentFragment();
    for (let j = 0; j < batchSize && idx < bootLines.length; j++, idx++) {
      const line = document.createElement('div');
      line.textContent = bootLines[idx];
      fragment.appendChild(line);
    }
    bootOutput.appendChild(fragment);
    bootOutput.scrollTop = bootOutput.scrollHeight;

    if (idx < bootLines.length) {
      requestAnimationFrame(showBatch);
    } else {
      setTimeout(() => {
        bootOutput.innerHTML = '';
        bootOutput.style.height = 'auto';
        bootScreen.classList.add('boot-screen--centered');
        const msgs = [
          '> inicializando ACM Student Chapter...',
          '> sistema listo. bienvenido.',
        ];

        function typeInit(lineIdx, charIdx, cursorEl) {
          if (charIdx < msgs[lineIdx].length) {
            cursorEl.before(document.createTextNode(msgs[lineIdx][charIdx]));
            requestAnimationFrame(() => typeInit(lineIdx, charIdx + 1, cursorEl));
          } else {
            cursorEl.remove();
            if (lineIdx + 1 < msgs.length) {
              const nextLine = document.createElement('div');
              const nextCursor = document.createElement('span');
              nextCursor.className = 'boot-cursor';
              nextLine.appendChild(nextCursor);
              bootOutput.appendChild(document.createElement('br'));
              bootOutput.appendChild(nextLine);
              requestAnimationFrame(() => typeInit(lineIdx + 1, 0, nextCursor));
            } else {
              setTimeout(() => {
                bootScreen.style.transition = 'opacity 0.3s ease';
                bootScreen.style.opacity = '0';
                setTimeout(() => {
                  bootScreen.style.display = 'none';
                  if (hero) hero.style.opacity = '1';

                  const isMobile = window.innerWidth < 768;
                  const model = document.querySelector('.hero-model');
                  const content = document.querySelector('.hero-content');

                  if (isMobile || !model) {
                    if (content) content.style.opacity = '1';
                    return;
                  }

                  if (content) content.style.opacity = '0';
                  if (window.__restartAnim) window.__restartAnim();

                  const heroEl = document.querySelector('.hero');
                  if (heroEl) heroEl.style.overflow = 'visible';

                  model.style.transition = 'none';
                  requestAnimationFrame(() => {
                    const rect = model.getBoundingClientRect();
                    const vpCenter = window.innerWidth / 2;
                    const modelCenter = rect.left + rect.width / 2;
                    const offset = vpCenter - modelCenter;
                    model.style.transform = `translateX(${offset}px) scale(1.5)`;
                    model.getBoundingClientRect();
                    if (window.__zoomCamera) window.__zoomCamera(6.75, 0);

                    setTimeout(() => {
                      if (window.__startAutoRotate) window.__startAutoRotate();

                      const dur = 1500;
                      model.style.transition = `transform ${dur}ms linear`;
                      model.style.transform = 'translateX(0) scale(1)';
                      if (window.__zoomCamera) window.__zoomCamera(4.5, dur);

                      if (heroEl) heroEl.style.overflow = '';
                      if (content) {
                        content.style.transition = 'opacity 0.6s ease 0.3s';
                        content.style.opacity = '1';
                      }
                    }, 1000);
                  });
                }, 350);
              }, 300);
            }
          }
        }

        const firstLine = document.createElement('div');
        const cursor = document.createElement('span');
        cursor.className = 'boot-cursor';
        firstLine.appendChild(cursor);
        bootOutput.appendChild(firstLine);
        requestAnimationFrame(() => typeInit(0, 0, cursor));
      }, 300);
    }
  }

  requestAnimationFrame(showBatch);
}
