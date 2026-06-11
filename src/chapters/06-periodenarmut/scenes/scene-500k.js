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
import { textIn, Y_IN, Y_OUT, DUR_IN, DUR_OUT } from '../../../core/text-anim.js';

const POV_SUB_CIRC = 2 * Math.PI * 108; // ≈ 678.6 — must match markup stroke-dasharray

export default {
  id: 's-ch6-500k',
  height: '150vh',
  skipSnapStart: true,
  snapPoints: [0.82],

  overlay: {
    id: 'st-ch6-500k',
    html: `<p class="sl">VON DIESEN 1,4 MILLIONEN<br>SIND</p>
           <p class="sh">500.000</p>
           <p class="sl">FRAUEN VON PERIODENARMUT BETROFFEN</p>`,
  },

  init({ gsap, ScrollTrigger, stage }) {
    const { povSub, povSubSpinner } = stage.refs;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '#s-ch6-500k',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.4,
      },
    });

    /* scene-1-4m owns #st-ch6-14m-main fade-out. */
    textIn(tl, '#st-ch6-500k', 0.10);

    /* Text stays visible until the next scene's text starts appearing. */
    ScrollTrigger.create({
      trigger:     '#s-ch6-folgen',
      start:       'top 80%',
      onEnter:     () => gsap.to('#st-ch6-500k', { opacity: 0, y: -Y_OUT(), duration: DUR_OUT, ease: 'power2.in' }),
      onLeaveBack: () => gsap.to('#st-ch6-500k', { opacity: 1, y: 0,        duration: DUR_IN,  ease: 'power2.out' }),
    });

    /* Pre-set the sub-circle to full radius so it appears at full size when faded in */
    tl.set(povSub, { attr: { r: POV_SUB_R } }, 0);

    /* Step 1: spinner appears and draws one full circle around the sub-circle outline */
    tl.to(povSubSpinner, { opacity: 1, duration: 0.04 }, 0.02);
    tl.to(povSubSpinner, {
      strokeDashoffset: 0,
      ease: 'power2.inOut',
      duration: 0.48,
    }, 0.06);

    /* Step 2: sub-circle fill fades in */
    tl.to(povSub, { opacity: 1, duration: 0.18, ease: 'power1.out' }, 0.56);

    /* Step 3: spinner fades out */
    tl.to(povSubSpinner, { opacity: 0, duration: 0.10 }, 0.76);

    tl.to({}, { duration: 0.02 }, 0.98);
  },
};
