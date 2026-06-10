import { textIn, textOut } from '../../../core/text-anim.js';

/* Markttest: which retailers passed on the full 10% saving (Jan 2026) */

export default {
  id: 's-ch9-realitaet',
  height: '200vh',
  skipSnapStart: true,

  overlay: {
    id: 'st-ch9-realitaet',
    html: `
      <p class="sl">1. JÄNNER 2026 — REALITÄTSCHECK</p>
      <p class="sh">362 Produkte.<br>10 Handelsketten.</p>
      <p class="sl">Wer hat die Ersparnis weitergegeben?</p>
    `,
  },

  init({ gsap, ScrollTrigger, stage }) {
    const SVG_NS = 'http://www.w3.org/2000/svg';

    // Build a simple bar chart in SVG showing retailers
    const retailers = [
      { name: 'Lidl',        passed: true  },
      { name: 'Penny',       passed: true  },
      { name: 'Hofer',       passed: true  },
      { name: 'Spar',        passed: true  },
      { name: 'Interspar',   passed: true  },
      { name: 'Bipa',        passed: true  },
      { name: 'Billa',       passed: true  },
      { name: 'DM',          passed: true  },
      { name: 'Müller',      passed: false },
    ];

    const container = document.getElementById('tl-cards');
    const g = document.createElementNS(SVG_NS, 'g');
    g.setAttribute('id', 'retailer-chart');
    g.setAttribute('opacity', '0');

    const startX = 560, startY = 80, rowH = 44, barMaxW = 340;

    retailers.forEach((r, i) => {
      const y = startY + i * rowH;
      const color = r.passed ? '#5BB85B' : '#D63335';
      const barW  = r.passed ? barMaxW : 40;

      // Bar
      const bar = document.createElementNS(SVG_NS, 'rect');
      bar.setAttribute('x',      startX);
      bar.setAttribute('y',      y);
      bar.setAttribute('width',  barW);
      bar.setAttribute('height', 28);
      bar.setAttribute('rx',     3);
      bar.setAttribute('fill',   color);
      bar.setAttribute('fill-opacity', '0.85');
      g.appendChild(bar);

      // Label
      const lbl = document.createElementNS(SVG_NS, 'text');
      lbl.setAttribute('x',    startX - 6);
      lbl.setAttribute('y',    y + 19);
      lbl.setAttribute('text-anchor', 'end');
      lbl.setAttribute('class', 'svg-mono');
      lbl.setAttribute('font-size', '8');
      lbl.setAttribute('fill', '#1a1a1a');
      lbl.setAttribute('letter-spacing', '1');
      lbl.textContent = r.name;
      g.appendChild(lbl);

      // Note for Müller
      if (!r.passed) {
        const note = document.createElementNS(SVG_NS, 'text');
        note.setAttribute('x',    startX + barW + 8);
        note.setAttribute('y',    y + 19);
        note.setAttribute('class', 'svg-mono');
        note.setAttribute('font-size', '7');
        note.setAttribute('fill', '#D63335');
        note.setAttribute('letter-spacing', '0.8');
        note.textContent = 'Keine Preissenkung · BWB übernimmt Kontrolle';
        g.appendChild(note);
      }
    });

    // Title
    const title = document.createElementNS(SVG_NS, 'text');
    title.setAttribute('x',    startX + barMaxW / 2);
    title.setAttribute('y',    startY - 18);
    title.setAttribute('text-anchor', 'middle');
    title.setAttribute('class', 'svg-mono');
    title.setAttribute('font-size', '7.5');
    title.setAttribute('fill', '#1a1a1a');
    title.setAttribute('letter-spacing', '1.5');
    title.textContent = 'PREISSENKUNG UM VOLLE 10 %?';
    g.appendChild(title);

    container.appendChild(g);

    // Make cards layer visible (may already be from timeline)
    document.getElementById('tl-cards').style.opacity = '1';

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '#s-ch9-realitaet',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.4,
      },
    });

    textIn(tl, '#st-ch9-realitaet', 0.05);
    textOut(tl, '#st-ch9-realitaet', 0.82);

    tl
      .to(g, { opacity: 1, duration: 0.25, ease: 'power1.out' }, 0.15)
      .to(g, { opacity: 0, duration: 0.10, ease: 'power1.in'  }, 0.88);
  },
};
