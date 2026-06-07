/* ═══════════════════════════════════════════════════════════════════
   SCENE — 90% Pie (Chapter 6, Scene 4)
   90% of the dark sub-circle sweeps in with an arc animation.
═══════════════════════════════════════════════════════════════════ */

export default {
  id: 's-ch6-pie90',
  height: '150vh',
  skipSnapStart: true,
  snapPoints: [0.55],

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

    /* scene-folgen owns #st-ch6-folgen fade-out. */
    tl.to('#st-ch6-pie90',  { opacity: 1, duration: 0.12, ease: 'power1.out' }, 0.12);
    tl.to('#st-ch6-pie90',  { opacity: 0, duration: 0.06, ease: 'power1.in'  }, 0.92);
    tl.to('#pov-pie-90',    { opacity: 1, duration: 0.01 }, 0.12);

    tl.to(proxy, {
      angle: 324,   // 90% of 360°
      duration: 0.30,
      ease: 'power2.out',
      onUpdate() {
        povPie90.setAttribute('d', sectorPath(POV_CX, POV_CY, POV_SUB_R, 0, Math.max(0.01, proxy.angle)));
      },
    }, 0.15);

    tl.to({}, { duration: 0.02 }, 0.98);
  },
};
