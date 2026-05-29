/* ═══════════════════════════════════════════════
   SCENE — Circle grows (s5)
   The filled circle expands (r 90 → 198) and the "1,9 Milliarden" text
   fades in. Scene 3 text is cleared on first scroll.
═══════════════════════════════════════════════ */
import { PIE_R } from '../../../core/constants.js';

export default {
  id: 's5',
  height: '200vh',
  overlay: {
    id: 'st5',
    html: `<p class="sl">WELTWEIT MENSTRUIEREN ÜBER</p>
           <p class="sh">1,9 MILLIARDEN</p>
           <p class="sl">MENSCHEN</p>`,
  },

  init({ gsap, stage }) {
    const { cFill } = stage.refs;

    const tl = gsap.timeline({
      scrollTrigger: { trigger: '#s5', start: 'top top', end: 'bottom bottom', scrub: 1.5 },
    });

    tl
      .to('#st3', { opacity: 0, duration: 0.2 }, 0)
      .to({}, { duration: 0.28 }, 0.02) // hold fully filled before growth
      .to(cFill, { attr: { r: PIE_R }, ease: 'power2.out', duration: 0.62 }, 0.30)
      .to('#st5', { opacity: 1, duration: 0.25 }, 0.72);
  },
};
