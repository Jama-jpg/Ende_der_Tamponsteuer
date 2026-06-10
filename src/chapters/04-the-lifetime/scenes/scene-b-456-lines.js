/* ═══════════════════════════════════════════════════════════════════
   SCENE B — 456 lines burst as barcode + "456 mal" text
   Enters from scene-a's end state: rect + 38 dividers, #st-p2 still visible.
   Crossfades #st-p2 → #st-p3; #st-p3 stays visible through the end.

   The 38 year-divider lines stay visible throughout — the 456 lines
   layer on top, spanning the rect width, so the combined effect reads
   like a dense barcode over the 38-year rectangle.

   Timeline (0 → 1 over 150vh):
     0.05–0.15  "38 Jahre" (#st-p2) fades out
     0.12–0.22  "456 mal" (#st-p3) fades in, stays visible through end
═══════════════════════════════════════════════════════════════════ */

import { textIn, textOut, setSceneVh } from '../../../core/text-anim.js';

export default {
  id: 's-periode-b',
  height: '150vh',
  skipSnapStart: true,

  init({ gsap, stage }) {
    setSceneVh(150);
    const { linesGrp, lineEls } = stage.refs;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '#s-periode-b',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.4,
      },
    });

    /* 456 lines expand from rect centre (x≈770–780) to rect bounds (x≈700–850)
       — layered on top of the 38 year-dividers for a barcode effect */
    tl
      .to(linesGrp, { opacity: 1, duration: 0.04 }, 0.15)
      .to(lineEls, {
        attr: () => ({
          x1: 700 + Math.random() * 3,
          x2: 847 + Math.random() * 3,
        }),
        stagger: { each: 0.0003, from: 'start' },
        ease: 'power2.out',
        duration: 0.38,
      }, 0.19);

    /* Crossfade "38 Jahre" → "456 mal". #st-p3 stays visible through the end
       of this scene — scene-c will crossfade to "7 Jahre". */
    textOut(tl, '#st-p2', 0.05);
    textIn(tl, '#st-p3', 0.12);

    tl.to({}, { duration: 0.02 }, 0.98);
  },
};
