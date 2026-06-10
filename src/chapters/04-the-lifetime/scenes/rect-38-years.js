/* ═══════════════════════════════════════════════
   SCENE — 38 years rect (s10)
   The month circles collapse and a thin vertical rect appears, with the
   "38 Jahre" text.
═══════════════════════════════════════════════ */

import { textIn, setSceneVh } from '../../../core/text-anim.js';

export default {
  id: 's10',
  height: '320vh',
  overlay: {
    id: 'st10',
    html: `<p class="sl">FÜR JEWEILS</p>
           <p class="sh">38 JAHRE</p>`,
  },

  init({ gsap, stage }) {
    setSceneVh(320);
    const { mcEls, mCircles, mRect } = stage.refs;

    const tl = gsap.timeline({
      scrollTrigger: { trigger: '#s10', start: 'top top', end: 'bottom bottom', scrub: 1.5 },
    });

    tl
      .to(mcEls, {
        attr: { r: 0 },
        stagger: { each: 0.018, from: 'start' },
        ease: 'power2.in',
        duration: 0.35,
      }, 0.02)
      .to(mCircles, { opacity: 0, duration: 0.08 }, 0.55)
      .to(mRect, { opacity: 1, duration: 0.18 }, 0.42);

    textIn(tl, '#st10', 0.62);

    tl.to({}, { duration: 0.6 });
  },
};
