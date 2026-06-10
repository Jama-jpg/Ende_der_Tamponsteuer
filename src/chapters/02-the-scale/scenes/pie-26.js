/* ═══════════════════════════════════════════════
   SCENE — 26% pie (s7)
   Scroll-triggered: as the user scrolls through this section the pink
   26% sector sweeps in and the left text swaps from "1,9 Milliarden"
   (#st5) to "26% der Weltbevölkerung" (#st7). Scrubbing back reverses
   everything automatically.
═══════════════════════════════════════════════ */

import { textIn, textOut, setSceneVh } from '../../../core/text-anim.js';

export default {
  id: 's7',
  height: '150vh',
  skipSnapStart: true,
  overlay: {
    id: 'st7',
    html: `<p class="sl">DAS SIND</p>
           <p class="sh">26%</p>
           <p class="sl">DER WELTBEVÖLKERUNG</p>`,
  },

  init({ gsap, stage, helpers, constants }) {
    setSceneVh(150);
    const r = stage.refs;
    const { sectorPath } = helpers;
    const { CX, CY, PIE_R } = constants;

    const pieProxy = { angle: 0 };
    gsap.set(r.pieHl, { opacity: 0 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '#s7',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.4,
      },
    });

    textOut(tl, '#st5', 0);
    textIn(tl, '#st7', 0.4);

    tl
      .to(r.pieHl, { opacity: 1, duration: 0.1, ease: 'none' }, 0.12)
      .to(pieProxy, {
        angle: 93.6,
        duration: 0.65,
        ease: 'power2.inOut',
        onUpdate() {
          r.pieHl.setAttribute('d', sectorPath(CX, CY, PIE_R, 0, pieProxy.angle));
        },
      }, 0.12);
  },
};
