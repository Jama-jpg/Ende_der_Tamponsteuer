import { SVG_NS, TL_COL_A_X, TL_COL_B_X } from '../../../core/constants.js';

const LEFT_LINES  = ['Die Geschichte der', 'Periodenprodukte', 'beginnt mit einfachsten Mitteln.'];
const RIGHT_LINES = ['Gleichzeitig beginnt die', 'Stigmatisierung der Periode', 'mit den ersten Vorurteilen und Mythen.'];

function buildIntroText(lines, cx, fill) {
  const container = document.getElementById('tl-cards');
  const g = document.createElementNS(SVG_NS, 'g');
  g.setAttribute('opacity', '0');

  const LINE_H = 28;
  const startY = 240;

  lines.forEach((line, i) => {
    const t = document.createElementNS(SVG_NS, 'text');
    t.setAttribute('x', cx);
    t.setAttribute('y', startY + i * LINE_H);
    t.setAttribute('text-anchor', 'middle');
    t.setAttribute('class', 'svg-serif svg-italic');
    t.setAttribute('font-size', '16');
    t.setAttribute('fill', fill);
    t.textContent = line;
    g.appendChild(t);
  });

  container.appendChild(g);
  return g;
}

export default {
  id:            's-tl-era-1',
  height:        '300vh',
  skipSnapStart: true,

  init({ gsap, ScrollTrigger }) {
    const leftEl  = buildIntroText(LEFT_LINES,  TL_COL_A_X, '#ffffff');
    const rightEl = buildIntroText(RIGHT_LINES, TL_COL_B_X, '#C9C9C0');

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '#s-tl-era-1',
        start:   'top top',
        end:     'bottom bottom',
        scrub:   0.4,
        onEnter() {
          const lbl = document.getElementById('lbl-year');
          if (lbl) lbl.textContent = '~1896';
        },
        onEnterBack() {
          const lbl = document.getElementById('lbl-year');
          if (lbl) lbl.textContent = '~1896';
        },
      },
    });

    tl.to(leftEl,  { opacity: 1, duration: 0.18, ease: 'power2.out' }, 0.05);
    tl.to(rightEl, { opacity: 1, duration: 0.18, ease: 'power2.out' }, 0.10);

    tl.to([leftEl, rightEl], { opacity: 0, duration: 0.10, ease: 'power1.in' }, 0.88);
  },
};
