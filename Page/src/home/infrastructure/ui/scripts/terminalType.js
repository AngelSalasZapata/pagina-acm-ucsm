export function typeText(el, text, speed, delay, onDone) {
  setTimeout(() => {
    let i = 0;
    el.innerHTML = '';
    const cursor = document.createElement('span');
    cursor.className = 'terminal-cursor';
    el.appendChild(cursor);
    const iv = setInterval(() => {
      el.insertBefore(document.createTextNode(text[i]), cursor);
      i++;
      if (i >= text.length) {
        clearInterval(iv);
        cursor.remove();
        if (onDone) onDone();
      }
    }, speed);
  }, delay);
}

const tline1 = document.getElementById('tline1');
const tline2 = document.getElementById('tline2');

if (tline1 && tline2) {
  typeText(tline1, '> inicializando ACM Student Chapter...', 38, 300, () => {
    typeText(tline2, '> sistema listo. bienvenido.', 38, 200);
  });
}
