import { textIn, textOut } from '../../../core/text-anim.js';

/* EU comparison table: VAT on period products 2026 */

const SVG_NS = 'http://www.w3.org/2000/svg';

const EU_DATA = [
  // 0%
  { country: 'Österreich',  rate: '0 %',  group: 0 },
  { country: 'Irland',      rate: '0 %',  group: 0 },
  { country: 'Luxemburg',   rate: '0 %',  group: 0 },
  { country: 'Malta',       rate: '0 %',  group: 0 },
  { country: 'Niederlande', rate: '0 %',  group: 0 },
  { country: 'England',     rate: '0 %',  group: 0 },
  { country: 'Zypern',      rate: '0 %',  group: 0 },
  { country: 'Spanien',     rate: '0 %',  group: 0 },
  // Reduced
  { country: 'Frankreich',  rate: '5,5 %', group: 1 },
  { country: 'Polen',       rate: '5 %',   group: 1 },
  { country: 'Belgien',     rate: '6 %',   group: 1 },
  { country: 'Portugal',    rate: '6 %',   group: 1 },
  { country: 'Deutschland', rate: '7 %',   group: 1 },
  // High
  { country: 'Italien',     rate: '22 %',  group: 2 },
  { country: 'Griechenland',rate: '23 %',  group: 2 },
  { country: 'Ungarn',      rate: '27 %',  group: 2 },
];

const GROUP_COLORS = ['#5BB85B', '#E8B84B', '#D63335'];
const GROUP_LABELS = ['0 %', 'Reduziert', 'Höher'];

export default {
  id: 's-ch9-eu',
  height: '200vh',
  skipSnapStart: true,

  overlay: {
    id: 'st-ch9-eu',
    html: `
      <p class="sl">EUROPA 2026</p>
      <p class="sh">Ungarn hält<br>den traurigen<br>Weltrekord.</p>
      <p class="sl">27 % Mehrwertsteuer auf Periodenprodukte</p>
    `,
  },

  init({ gsap, ScrollTrigger }) {
    const container = document.getElementById('tl-cards');
    const g = document.createElementNS(SVG_NS, 'g');
    g.setAttribute('id', 'eu-table');
    g.setAttribute('opacity', '0');

    const colW = 130, startX = 560, startY = 55, rowH = 28;

    // Column headers
    ['0 %  (Steuerfrei)', 'Reduziert', 'Hoch'].forEach((hdr, col) => {
      const hx = startX + col * colW + colW / 2;
      const bg = document.createElementNS(SVG_NS, 'rect');
      bg.setAttribute('x', startX + col * colW); bg.setAttribute('y', startY);
      bg.setAttribute('width', colW - 6); bg.setAttribute('height', 22);
      bg.setAttribute('rx', 3); bg.setAttribute('fill', GROUP_COLORS[col]);
      bg.setAttribute('fill-opacity', '0.85');
      g.appendChild(bg);

      const t = document.createElementNS(SVG_NS, 'text');
      t.setAttribute('x', hx); t.setAttribute('y', startY + 14);
      t.setAttribute('text-anchor', 'middle');
      t.setAttribute('class', 'svg-mono'); t.setAttribute('font-size', '7');
      t.setAttribute('fill', '#ffffff'); t.setAttribute('letter-spacing', '1');
      t.textContent = hdr;
      g.appendChild(t);
    });

    // Rows per column
    const byGroup = [[], [], []];
    EU_DATA.forEach(d => byGroup[d.group].push(d));

    byGroup.forEach((entries, col) => {
      entries.forEach((d, row) => {
        const ry = startY + 28 + row * rowH;
        const rx = startX + col * colW;

        const bg = document.createElementNS(SVG_NS, 'rect');
        bg.setAttribute('x', rx); bg.setAttribute('y', ry);
        bg.setAttribute('width', colW - 6); bg.setAttribute('height', rowH - 4);
        bg.setAttribute('rx', 2);
        bg.setAttribute('fill', GROUP_COLORS[col]);
        bg.setAttribute('fill-opacity', col === 2 && d.country === 'Ungarn' ? '0.80' : '0.10');
        g.appendChild(bg);

        const name = document.createElementNS(SVG_NS, 'text');
        name.setAttribute('x', rx + 8); name.setAttribute('y', ry + 16);
        name.setAttribute('class', 'svg-mono'); name.setAttribute('font-size', '7.5');
        name.setAttribute('fill', col === 2 && d.country === 'Ungarn' ? '#ffffff' : '#1a1a1a');
        name.setAttribute('letter-spacing', '0.5');
        name.textContent = d.country;
        g.appendChild(name);

        const rate = document.createElementNS(SVG_NS, 'text');
        rate.setAttribute('x', rx + colW - 14); rate.setAttribute('y', ry + 16);
        rate.setAttribute('text-anchor', 'end');
        rate.setAttribute('class', 'svg-serif svg-italic'); rate.setAttribute('font-size', '9');
        rate.setAttribute('fill', GROUP_COLORS[col]);
        rate.textContent = d.rate;
        g.appendChild(rate);
      });
    });

    container.appendChild(g);
    document.getElementById('tl-cards').style.opacity = '1';

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '#s-ch9-eu',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.4,
      },
    });

    textIn(tl, '#st-ch9-eu', 0.05);
    textOut(tl, '#st-ch9-eu', 0.84);

    tl
      .to(g, { opacity: 1, duration: 0.25, ease: 'power1.out' }, 0.10)
      .to(g, { opacity: 0, duration: 0.10, ease: 'power1.in'  }, 0.90);
  },
};
