/* ═══════════════════════════════════════════════════════════════════
   SCENE — 60% Pie (Chapter 6, Scene 5)
   60% sector sweeps in on top of the 90% sector.
   All previous sectors remain visible.
═══════════════════════════════════════════════════════════════════ */

export default {
  id: 's-ch6-pie60',
  height: '150vh',
  skipSnapStart: true,

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

    /* scene-pie-90 owns #st-ch6-pie90 fade-out. */
    tl.to('#st-ch6-pie60', { opacity: 1, duration: 0.12, ease: 'power1.out' }, 0.12);
    tl.to('#st-ch6-pie60', { opacity: 0, duration: 0.08, ease: 'power1.in'  }, 0.89);
    tl.to('#pov-pie-60',   { opacity: 1, duration: 0.01 }, 0.12);

    tl.to(proxy, {
      angle: 216,   // 60% of 360°
      duration: 0.30,
      ease: 'power2.out',
      onUpdate() {
        povPie60.setAttribute('d', sectorPath(POV_CX, POV_CY, POV_SUB_R, 0, Math.max(0.01, proxy.angle)));
      },
    }, 0.15);

    tl.to({}, { duration: 0.02 }, 0.98);
  },
};
