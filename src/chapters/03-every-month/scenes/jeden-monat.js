/* ═══════════════════════════════════════════════
   SCENE — Jeden Monat → 12 circles (s8)
   "Jeden Monat" lands over the full red circle, then — right away, in one
   continuous scrub — the circle stretches up the axis, snaps away and twelve
   month circles fan out down the spine. Ends with the 12 circles in place for
   the Lifetime chapter (no separate long split scene anymore).
═══════════════════════════════════════════════ */
import { CX, CY, MC_Y } from '../../../core/constants.js';

export default {
  id: 's8',
  height: '220vh',
  overlay: {
    id: 'st8',
    html: `<p class="sl">UND DAS</p>
           <p class="sh">JEDEN MONAT</p>`,
  },

  init({ gsap, stage }) {
    const { cFill, mCircles, mcEls } = stage.refs;

    const tl = gsap.timeline({
      scrollTrigger: { trigger: '#s8', start: 'top top', end: 'bottom bottom', scrub: 1.5 },
    });

    tl
      /* "Jeden Monat" lands first, almost immediately on entering … */
      .to('#st8', { opacity: 1, duration: 0.12, ease: 'power1.out' }, 0.04)
      /* … then the big circle stretches up the axis … */
      .to(cFill, { scaleY: 3.2, svgOrigin: `${CX} ${CY}`, ease: 'power3.in', duration: 0.30 }, 0.20)
      /* … snaps away while the twelve stacked circles take over … */
      .to(cFill, { opacity: 0, scaleY: 1, duration: 0.12, ease: 'power2.out' }, 0.50)
      .to(mCircles, { opacity: 1, duration: 0.10 }, 0.52)
      /* … which fan out to one circle per month. */
      .to(mcEls, {
        attr: (i) => ({ cy: MC_Y[i] }),
        stagger: { each: 0.02, from: 'center' },
        ease: 'back.out(1.1)',
        duration: 0.40,
      }, 0.54)
      /* Text clears before the next scene. */
      .to('#st8', { opacity: 0, duration: 0.12, ease: 'power1.in' }, 1.00);
  },
};
