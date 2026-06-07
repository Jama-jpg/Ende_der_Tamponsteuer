/* Shared factory for all Era scenes.
   createEraScene({ id, era, height, spurs, yearLabel }) returns a scene object. */

import { EVENTS } from '../timeline-data.js';
import { buildCard, buildColumnHeaders, clearCards } from '../timeline-layout.js';

/* Y positions for stacking multiple cards in a column */
const CARD_MARGIN = 12;

export function createEraScene({ id, era, height, spurs, yearLabel }) {
  return {
    id,
    height,
    skipSnapStart: true,

    init({ gsap, ScrollTrigger }) {
      const cardEls = [];
      const eraEvents = EVENTS.filter(e => e.era === era && spurs.includes(e.spur));

      // Group events by spur for vertical stacking
      const byCol = { A: [], B: [], C: [] };
      eraEvents.forEach(e => byCol[e.spur].push(e));

      // Build all cards upfront (initially opacity=0)
      Object.entries(byCol).forEach(([spur, events]) => {
        let yTop = 60;
        events.forEach(evt => {
          const el = buildCard({ ...evt, spur, yTop });
          cardEls.push(el);
          // Approximate card height: header(30) + title(16) + lines*10 + padding(12)
          const lines = evt.text.split('\n').length;
          yTop += 30 + 16 + lines * 10 + CARD_MARGIN + 20;
        });
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: `#${id}`,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.4,
          onEnter() {
            buildColumnHeaders(spurs, gsap);
            // Update year display
            const lbl = document.getElementById('lbl-year');
            if (lbl) lbl.textContent = yearLabel;
          },
          onEnterBack() {
            const lbl = document.getElementById('lbl-year');
            if (lbl) lbl.textContent = yearLabel;
          },
        },
      });

      // Stagger cards in
      cardEls.forEach((el, i) => {
        tl.to(el, { opacity: 1, y: 0, duration: 0.18, ease: 'power2.out' }, 0.05 + i * 0.04);
      });

      // Hold through scroll, then fade out near end
      tl.to(cardEls, { opacity: 0, duration: 0.10, ease: 'power1.in' }, 0.88);
    },
  };
}
