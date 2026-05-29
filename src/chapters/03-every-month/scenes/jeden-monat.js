/* ═══════════════════════════════════════════════
   SCENE — Jeden Monat (s8)
   The solid circle holds at full size and the "Jeden Monat" text fades in.
   (The pie hover + its text are torn down by pie-26.js when s7 is left.)
═══════════════════════════════════════════════ */
import { PIE_R } from '../../../core/constants.js';

export default {
  id: 's8',
  height: '150vh',
  overlay: {
    id: 'st8',
    html: `<p class="sl">UND DAS</p>
           <p class="sh">JEDEN MONAT</p>`,
  },

  init({ gsap, stage }) {
    const { cFill } = stage.refs;

    const tl = gsap.timeline({
      scrollTrigger: { trigger: '#s8', start: 'top top', end: 'bottom bottom', scrub: 1.5 },
    });

    tl
      .to(cFill, { opacity: 1, attr: { r: PIE_R }, duration: 0.25, ease: 'power1.out' }, 0.25)
      .to('#st8', { opacity: 1, duration: 0.25 }, 0.48);
  },
};
