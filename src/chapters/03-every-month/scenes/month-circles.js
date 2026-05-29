/* ═══════════════════════════════════════════════
   SCENE — Month circles (s9)
   The circle stretches into a vertical ellipse, snaps away, and twelve
   month circles fan out down the axis.
═══════════════════════════════════════════════ */
import { CX, CY, MC_Y } from '../../../core/constants.js';

export default {
  id: 's9',
  height: '250vh',

  init({ gsap, stage }) {
    const { cFill, mCircles, mcEls } = stage.refs;

    const tl = gsap.timeline({
      scrollTrigger: { trigger: '#s9', start: 'top top', end: 'bottom bottom', scrub: 1.5 },
    });

    tl
      .to('#st8', { opacity: 0, duration: 0.15 }, 0)
      .to(cFill, { scaleY: 3.2, svgOrigin: `${CX} ${CY}`, ease: 'power3.in', duration: 0.35 }, 0.04)
      .to(cFill, { opacity: 0, scaleY: 1, duration: 0.12, ease: 'power2.out' }, 0.40)
      .to(mCircles, { opacity: 1, duration: 0.1 }, 0.44)
      .to(mcEls, {
        attr: (i) => ({ cy: MC_Y[i] }),
        stagger: { each: 0.022, from: 'center' },
        ease: 'back.out(1.2)',
        duration: 0.45,
      }, 0.46);
  },
};
