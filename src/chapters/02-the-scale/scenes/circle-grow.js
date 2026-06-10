/* ═══════════════════════════════════════════════
   SCENE — Circle grows (s5)
   "1,9 Milliarden" text swaps in, circle expands r 90 → 198.
   Pulse is started/stopped by period-axis.js (s3) and runs through this
   scene automatically — no separate ScrollTrigger needed here.
═══════════════════════════════════════════════ */
import { PIE_R } from '../../../core/constants.js';
import { textIn, textOut, setSceneVh } from '../../../core/text-anim.js';

export default {
  id: 's5',
  height: '150vh',
  skipSnapStart: true,
  overlay: {
    id: 'st5',
    html: `<p class="sl">EIN ABO, DAS WELTWEIT ÜBER</p>
           <p class="sh">1,9 MILLIARDEN</p>
           <p class="sl">MENSCHEN TEILEN:</p>
           <p class="sl">Die Menstruation</p>`,
  },

  init({ gsap, stage }) {
    setSceneVh(150);
    const { cFill } = stage.refs;

    const tl = gsap.timeline({
      scrollTrigger: { trigger: '#s5', start: 'top top', end: 'bottom bottom', scrub: 0.4 },
    });

    textOut(tl, '#st3', 0.06);
    textIn(tl, '#st5', 0.10);

    tl
      /* Circle grows. */
      .to(cFill,  { attr: { r: PIE_R }, ease: 'power2.out', duration: 0.80 }, 0);
      /* #st3 (from s3) stays visible through the circle animation, fades out as new text arrives. */
  },
};
