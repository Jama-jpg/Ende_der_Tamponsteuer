/* ═══════════════════════════════════════════════
   SCENE — Circle grows (s5)
   "1,9 Milliarden" text swaps in, circle expands r 90 → 198.
   Pulse is started/stopped by period-axis.js (s3) and runs through this
   scene automatically — no separate ScrollTrigger needed here.
═══════════════════════════════════════════════ */
import { PIE_R } from '../../../core/constants.js';

export default {
  id: 's5',
  height: '200vh',
  skipSnapStart: true,
  overlay: {
    id: 'st5',
    html: `<p class="sl">EIN ABO, DAS WELTWEIT ÜBER</p>
           <p class="sh">1,9 MILLIARDEN</p>
           <p class="sl">MENSCHEN TEILEN:</p>
           <p class="sl">Die Menstruation</p>`,
  },

  init({ gsap, stage }) {
    const { cFill } = stage.refs;

    const tl = gsap.timeline({
      scrollTrigger: { trigger: '#s5', start: 'top top', end: 'bottom bottom', scrub: 1 },
    });

    tl
      /* Old text ("Abonnement") fades out first. */
      .to('#st3', { opacity: 0, duration: 0.12, ease: 'power1.in' }, 0)
      /* New text fades in after a brief gap ("erst weg, dann neu"). */
      .to('#st5', { opacity: 1, duration: 0.30, ease: 'power1.out' }, 0.22)
      /* Circle grows from small to full pie radius, parallel with text. */
      .to(cFill,  { attr: { r: PIE_R }, ease: 'power2.out', duration: 0.62 }, 0.30);
  },
};
