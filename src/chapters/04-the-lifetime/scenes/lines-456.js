/* ═══════════════════════════════════════════════
   SCENE — 456 lines (s12)
   The rect bursts into 456 horizontal lines spanning the viewport, with
   the "456 mal" text.
═══════════════════════════════════════════════ */

import { textIn, textOut } from '../../../core/text-anim.js';

export default {
  id: 's12',
  height: '300vh',
  overlay: {
    id: 'st12',
    html: `<p class="sl">INSGESAMT</p>
           <p class="sh">456 mal</p>`,
  },

  init({ gsap, stage }) {
    const { linesGrp, lineEls } = stage.refs;

    const tl = gsap.timeline({
      scrollTrigger: { trigger: '#s12', start: 'top top', end: 'bottom bottom', scrub: 1.5 },
    });

    textOut(tl, '#st10', 0, { duration: 0.12 });
    textIn(tl, '#st12', 0.65, { duration: 0.2 });

    tl
      .to(linesGrp, { opacity: 1, duration: 0.1 }, 0.06)
      .to(lineEls, {
        attr: () => ({
          x1: 40  + Math.random() * 20,
          x2: 940 + Math.random() * 30,
        }),
        stagger: { each: 0.0028, from: 'start' },
        ease: 'power2.out',
        duration: 0.55,
      }, 0.08);
  },
};
