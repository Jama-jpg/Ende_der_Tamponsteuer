/* ═══════════════════════════════════════════════════════════════════
   SCENE — 90% Pie (Chapter 6, Scene 4)
   90% of the dark sub-circle sweeps in with an arc animation.
═══════════════════════════════════════════════════════════════════ */

import { textIn, textOut } from '../../../core/text-anim.js';

export default {
  id: 's-ch6-pie90',
  height: '150vh',
  skipSnapStart: true,
  skipSnapEnd: true,
  snapPoints: [0.70],

  overlay: {
    id: 'st-ch6-pie90',
    html: `<p class="sh">90%</p>
           <p class="sl">finden dass sie Periodenprodukte<br>im Handel zu teuer sind</p>`,
  },

  init({ gsap, stage, helpers, constants }) {
    const { povPie90 } = stage.refs;
    const { sectorPath } = helpers;
    const { POV_CX, POV_CY, POV_SUB_R } = constants;

    /* Reset sector to empty so the sweep starts from 0 */
    povPie90.setAttribute('d', sectorPath(POV_CX, POV_CY, POV_SUB_R, 0, 0.01));

    const proxy = { angle: 0 };

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '#s-ch6-pie90',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.4,
      },
    });

    /* scene-pie-60 owns #st-ch6-pie60 fade-out. */
    textIn(tl,  '#st-ch6-pie90', 0.12, { duration: 0.12 });
    textOut(tl, '#st-ch6-pie90', 0.92, { duration: 0.06 });
    tl.to('#pov-pie-90',    { opacity: 1, duration: 0.01 }, 0.12);

    tl.to(proxy, {
      angle: 324,   // 90% of 360°
      duration: 0.50,
      ease: 'power2.out',
      onUpdate() {
        povPie90.setAttribute('d', sectorPath(POV_CX, POV_CY, POV_SUB_R, 0, Math.max(0.01, proxy.angle)));
      },
    }, 0.15);

    tl.to({}, { duration: 0.02 }, 0.98);
  },
};
