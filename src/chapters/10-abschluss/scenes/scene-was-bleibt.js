import { textIn, textOut } from '../../../core/text-anim.js';

/* „Was bleibt" — statistics on remaining burden despite 0% VAT */

const SVG_NS = 'http://www.w3.org/2000/svg';

const STATS = [
  { num: '88 %',   text: 'der Mädchen in Österreich\nleiden unter Periodenbeschwerden' },
  { num: '1 von 3', text: 'unter starken Krämpfen' },
  { num: '10 %+',  text: 'können während ihrer Periode\nnicht zur Schule oder Arbeit' },
];

export default {
  id: 's-ch10-was-bleibt',
  height: '200vh',
  skipSnapStart: true,

  overlay: {
    id: 'st-ch10-was-bleibt',
    html: `
      <p class="sl">WAS BLEIBT</p>
      <p class="sh">Solange Periodenprodukte in Schulen nicht frei verfügbar sind —</p>
      <p class="sl">bleibt Menstruation eine Hürde für die volle Teilhabe am öffentlichen Leben.</p>
    `,
  },

  init({ gsap, ScrollTrigger }) {
    const container = document.getElementById('tl-cards');
    const g = document.createElementNS(SVG_NS, 'g');
    g.setAttribute('id', 'stats-grp');
    g.setAttribute('opacity', '0');

    STATS.forEach((s, i) => {
      const x = 570 + i * 145;
      const y = 150;

      const numEl = document.createElementNS(SVG_NS, 'text');
      numEl.setAttribute('x', x); numEl.setAttribute('y', y);
      numEl.setAttribute('text-anchor', 'middle');
      numEl.setAttribute('class', 'svg-serif svg-italic');
      numEl.setAttribute('font-size', '28'); numEl.setAttribute('fill', '#D63335');
      numEl.textContent = s.num;
      g.appendChild(numEl);

      const lines = s.text.split('\n');
      lines.forEach((line, li) => {
        const t = document.createElementNS(SVG_NS, 'text');
        t.setAttribute('x', x); t.setAttribute('y', y + 22 + li * 14);
        t.setAttribute('text-anchor', 'middle');
        t.setAttribute('class', 'svg-mono'); t.setAttribute('font-size', '7');
        t.setAttribute('fill', '#1a1a1a'); t.setAttribute('letter-spacing', '0.5');
        t.textContent = line;
        g.appendChild(t);
      });
    });

    container.appendChild(g);
    document.getElementById('tl-cards').style.opacity = '1';

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '#s-ch10-was-bleibt',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.4,
      },
    });

    textIn(tl, '#st-ch10-was-bleibt', 0.05);
    textOut(tl, '#st-ch10-was-bleibt', 0.82);

    tl
      .to(g, { opacity: 1, duration: 0.25, ease: 'power1.out' }, 0.15)
      .to(g, { opacity: 0, duration: 0.10, ease: 'power1.in'  }, 0.88);
  },
};
