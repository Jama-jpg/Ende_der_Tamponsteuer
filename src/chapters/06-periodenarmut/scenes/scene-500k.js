/* ═══════════════════════════════════════════════════════════════════
   SCENE — 500.000 (Chapter 6, Scene 2)
   Darker sub-circle grows inside the big red circle, representing
   the 500k women affected by period poverty.

   Timeline (0 → 1 over 150vh):
     0.00–0.12  Text swap
     0.15–0.50  Dark sub-circle grows r: 0 → 108
     0.50–1.00  Hold
═══════════════════════════════════════════════════════════════════ */
import { POV_SUB_R } from '../../../core/constants.js';

export default {
  id: 's-ch6-500k',
  height: '150vh',
  skipSnapStart: true,

  overlay: {
    id: 'st-ch6-500k',
    html: `<p class="sl">VON DIESEN 1,4 MILLIONEN<br>SIND</p>
           <p class="sh">500.000</p>
           <p class="sl">FRAUEN VON PERIODENARMUT BETROFFEN</p>`,
  },

  init({ gsap, stage }) {
    const { povSub } = stage.refs;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '#s-ch6-500k',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.7,
      },
    });

    tl.to('#st-ch6-14m-main', { opacity: 0, duration: 0.10 }, 0);
    tl.to('#st-ch6-hover17',  { opacity: 0, duration: 0.10 }, 0);
    tl.to('#st-ch6-500k',     { opacity: 1, duration: 0.12, ease: 'power1.out' }, 0.10);

    tl.to(povSub, { opacity: 1, attr: { r: POV_SUB_R }, ease: 'power2.out', duration: 0.30 }, 0.18);

    tl.to({}, { duration: 0.02 }, 0.98);
  },
};
