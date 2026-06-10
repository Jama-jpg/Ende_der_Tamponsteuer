/* ═══════════════════════════════════════════════════════════════════
   SCENE — 12% Pie (Chapter 6, Scene 7)
   12% sector sweeps in, completing the cumulative pie.
═══════════════════════════════════════════════════════════════════ */

import { textIn } from '../../../core/text-anim.js';

export default {
  id: 's-ch6-pie12',
  height: '150vh',
  skipSnapStart: true,
  skipSnapEnd: true,
  snapPoints: [0.70],

  overlay: {
    id: 'st-ch6-pie12',
    html: `<p class="sh">12%</p>
           <p class="sl">zögern den Wechsel vom Periodenprodukten<br>bewusst hinaus um Material zu sparen.<br>Das erhöht das Risiko für<br>Infektionen und TSS.</p>`,
  },

  init({ gsap, stage, helpers, constants }) {
    const { povPie12 } = stage.refs;
    const { sectorPath } = helpers;
    const { POV_CX, POV_CY, POV_SUB_R } = constants;

    povPie12.setAttribute('d', sectorPath(POV_CX, POV_CY, POV_SUB_R, 0, 0.01));

    const proxy = { angle: 0 };

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '#s-ch6-pie12',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.4,
      },
    });

    /* scene-steuer-intro owns #st-ch6-pie12 fade-out. */
    textIn(tl, '#st-ch6-pie12', 0.12);
    tl.to('#pov-pie-12',   { opacity: 1, duration: 0.01 }, 0.12);

    tl.to(proxy, {
      angle: 43.2,  // 12% of 360°
      duration: 0.50,
      ease: 'power2.out',
      onUpdate() {
        povPie12.setAttribute('d', sectorPath(POV_CX, POV_CY, POV_SUB_R, 0, Math.max(0.01, proxy.angle)));
      },
    }, 0.15);

    tl.to({}, { duration: 0.02 }, 0.98);
  },
};
