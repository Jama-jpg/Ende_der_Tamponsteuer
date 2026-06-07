/* Shared helpers for all era scenes in Chapter 08.
   - buildCard()    renders one SVG card for an event into #tl-cards
   - clearCards()   removes all cards
   - Column geometry constants (re-exported from constants.js) */

import { SVG_NS, TL_COL_A_X, TL_COL_B_X, TL_COL_C_X } from '../../core/constants.js';

const COL = {
  A: { cx: TL_COL_A_X, x1: 18,  x2: 316, fill: '#D63335', labelColor: '#f4dedb' },
  B: { cx: TL_COL_B_X, x1: 351, x2: 649, fill: '#2a2a22', labelColor: '#C9C9C0' },
  C: { cx: TL_COL_C_X, x1: 684, x2: 982, fill: '#D63335', labelColor: '#f4dedb' },
};

/* Build a single event card and append it to #tl-cards.
   Returns the created <g> element so the caller can animate it. */
export function buildCard({ spur, year, title, text, yTop = 60 }) {
  const cfg   = COL[spur];
  const container = document.getElementById('tl-cards');
  const g = document.createElementNS(SVG_NS, 'g');
  g.setAttribute('opacity', '0');

  const W = cfg.x2 - cfg.x1;
  const PAD = 12;

  // Background rect
  const bg = document.createElementNS(SVG_NS, 'rect');
  bg.setAttribute('x',      cfg.x1);
  bg.setAttribute('y',      yTop);
  bg.setAttribute('width',  W);
  bg.setAttribute('height', 20); // will be updated after measuring text lines
  bg.setAttribute('rx',     4);
  bg.setAttribute('fill',   cfg.fill);
  bg.setAttribute('fill-opacity', '0.92');
  g.appendChild(bg);

  // Year label
  const yearEl = document.createElementNS(SVG_NS, 'text');
  yearEl.setAttribute('x',    cfg.x1 + PAD);
  yearEl.setAttribute('y',    yTop + PAD + 8);
  yearEl.setAttribute('class','svg-mono');
  yearEl.setAttribute('font-size', '7');
  yearEl.setAttribute('fill',  cfg.labelColor);
  yearEl.setAttribute('letter-spacing', '1.5');
  yearEl.textContent = year;
  g.appendChild(yearEl);

  // Title
  const titleEl = document.createElementNS(SVG_NS, 'text');
  titleEl.setAttribute('x',    cfg.x1 + PAD);
  titleEl.setAttribute('y',    yTop + PAD + 22);
  titleEl.setAttribute('class','svg-serif svg-italic');
  titleEl.setAttribute('font-size', '12');
  titleEl.setAttribute('fill',  '#ffffff');
  titleEl.textContent = title;
  g.appendChild(titleEl);

  // Body text — line-wrapped manually using <tspan>
  const lines = text.split('\n');
  const bodyEl = document.createElementNS(SVG_NS, 'text');
  bodyEl.setAttribute('x',    cfg.x1 + PAD);
  bodyEl.setAttribute('y',    yTop + PAD + 38);
  bodyEl.setAttribute('class','svg-mono');
  bodyEl.setAttribute('font-size', '6.5');
  bodyEl.setAttribute('fill',  'rgba(255,255,255,0.80)');
  bodyEl.setAttribute('letter-spacing', '0.5');
  lines.forEach((line, i) => {
    const span = document.createElementNS(SVG_NS, 'tspan');
    span.setAttribute('x',  cfg.x1 + PAD);
    span.setAttribute('dy', i === 0 ? '0' : '10');
    span.textContent = line;
    bodyEl.appendChild(span);
  });
  g.appendChild(bodyEl);

  // Now fix background height based on content
  const totalHeight = PAD + 8 + 14 + 16 + (lines.length * 10) + PAD;
  bg.setAttribute('height', totalHeight);

  container.appendChild(g);
  return g;
}

/* Remove all children of #tl-cards */
export function clearCards() {
  const c = document.getElementById('tl-cards');
  while (c.firstChild) c.removeChild(c.firstChild);
}

/* Show label strip at top of each active column */
export function buildColumnHeaders(spurs, gsap) {
  const labels = { A: 'PRODUKTE', B: 'AKTIVISMUS', C: 'MEHRWERTSTEUER' };
  spurs.forEach(spur => {
    const cfg = COL[spur];
    const existing = document.getElementById(`tl-hdr-${spur}`);
    if (existing) return;

    const container = document.getElementById('tl-cards');
    const g = document.createElementNS(SVG_NS, 'g');
    g.setAttribute('id', `tl-hdr-${spur}`);
    g.setAttribute('opacity', '0');

    const W = cfg.x2 - cfg.x1;
    const bg = document.createElementNS(SVG_NS, 'rect');
    bg.setAttribute('x',      cfg.x1);
    bg.setAttribute('y',      40);
    bg.setAttribute('width',  W);
    bg.setAttribute('height', 16);
    bg.setAttribute('rx',     2);
    bg.setAttribute('fill',   spur === 'B' ? '#2a2a22' : '#531416');
    g.appendChild(bg);

    const lbl = document.createElementNS(SVG_NS, 'text');
    lbl.setAttribute('x',    cfg.cx);
    lbl.setAttribute('y',    51);
    lbl.setAttribute('text-anchor', 'middle');
    lbl.setAttribute('class','svg-mono');
    lbl.setAttribute('font-size', '6');
    lbl.setAttribute('fill',  '#C9C9C0');
    lbl.setAttribute('letter-spacing', '2');
    lbl.textContent = `SPUR ${spur}  ·  ${labels[spur]}`;
    g.appendChild(lbl);

    container.appendChild(g);
    gsap.to(g, { opacity: 1, duration: 0.3, ease: 'power1.out' });
  });
}

export { COL };
