/* ═══════════════════════════════════════════════
   SCENE — Jeden Monat (s8)
   The hover-pie is cleaned up, the solid circle holds at full size, and
   the "Jeden Monat" text fades in.
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

  init({ gsap, stage, shared }) {
    const { cFill } = stage.refs;

    const tl = gsap.timeline({
      scrollTrigger: { trigger: '#s8', start: 'top top', end: 'bottom bottom', scrub: 1.5 },
    });

    tl
      .call(() => shared.pie?.leave(), [], 0)
      .to(cFill, { opacity: 1, attr: { r: PIE_R }, duration: 0.25, ease: 'power1.out' }, 0.25)
      .to('#st8', { opacity: 1, duration: 0.25 }, 0.48);
  },
};
