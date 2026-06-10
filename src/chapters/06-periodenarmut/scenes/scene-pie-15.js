/* ═══════════════════════════════════════════════════════════════════
   SCENE — 15% Pie (Chapter 6, Scene 6)
   15% sector sweeps in on top of 90% + 60%.
═══════════════════════════════════════════════════════════════════ */

import { textIn, textOut } from '../../../core/text-anim.js';

export default {
  id: 's-ch6-pie15',
  height: '150vh',
  skipSnapStart: true,
  skipSnapEnd: true,
  snapPoints: [0.70],

  overlay: {
    id: 'st-ch6-pie15',
    html: `<p class="sh">15%</p>
           <p class="sl">versuchen, so wenig Material wie<br>möglich zu verbrauchen</p>`,
  },

  init({ gsap, stage, helpers, constants }) {
    const { povPie15 } = stage.refs;
    const { sectorPath } = helpers;
    const { POV_CX, POV_CY, POV_SUB_R } = constants;

    povPie15.setAttribute('d', sectorPath(POV_CX, POV_CY, POV_SUB_R, 0, 0.01));

    const proxy = { angle: 0 };

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '#s-ch6-pie15',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.4,
      },
    });

    /* scene-pie-12 owns #st-ch6-pie12 fade-out. */
    textIn(tl,  '#st-ch6-pie15', 0.12, { duration: 0.12 });
    textOut(tl, '#st-ch6-pie15', 0.92, { duration: 0.06 });
    tl.to('#pov-pie-15',   { opacity: 1, duration: 0.01 }, 0.12);

    tl.to(proxy, {
      angle: 54,    // 15% of 360°
      duration: 0.50,
      ease: 'power2.out',
      onUpdate() {
        povPie15.setAttribute('d', sectorPath(POV_CX, POV_CY, POV_SUB_R, 0, Math.max(0.01, proxy.angle)));
      },
    }, 0.15);

    tl.to({}, { duration: 0.02 }, 0.98);
  },
};
