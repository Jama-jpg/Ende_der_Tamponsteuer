/* ═══════════════════════════════════════════════════════════════════
   SCENE — 60% Pie (Chapter 6, Scene 5)
   60% sector sweeps in on top of the 90% sector.
   All previous sectors remain visible.
═══════════════════════════════════════════════════════════════════ */

import { textIn, textOut } from '../../../core/text-anim.js';

export default {
  id: 's-ch6-pie60',
  height: '200vh',
  skipSnapStart: true,
  skipSnapEnd: true,
  snapPoints: [0.70],

  overlay: {
    id: 'st-ch6-pie60',
    html: `<p class="sl">Für über</p>
           <p class="sh">60%</p>
           <p class="sl">stellte der Kauf von Tampons und Binden<br>eine finanzielle Belastung dar.</p>`,
  },

  init({ gsap, stage, helpers, constants }) {
    const { povPie60 } = stage.refs;
    const { sectorPath } = helpers;
    const { POV_CX, POV_CY, POV_SUB_R } = constants;

    povPie60.setAttribute('d', sectorPath(POV_CX, POV_CY, POV_SUB_R, 0, 0.01));

    const proxy = { angle: 0 };

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '#s-ch6-pie60',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.4,
      },
    });

    /* scene-pie-15 owns #st-ch6-pie15 fade-out. */
    textIn(tl, '#st-ch6-pie60', 0.12);
    textOut(tl, '#st-ch6-pie60', 0.92);
    tl.to('#pov-pie-60',   { opacity: 1, duration: 0.01 }, 0.12);

    tl.to(proxy, {
      angle: 216,   // 60% of 360°
      duration: 0.50,
      ease: 'power2.out',
      onUpdate() {
        povPie60.setAttribute('d', sectorPath(POV_CX, POV_CY, POV_SUB_R, 0, Math.max(0.01, proxy.angle)));
      },
    }, 0.15);

    tl.to({}, { duration: 0.02 }, 0.98);
  },
};
