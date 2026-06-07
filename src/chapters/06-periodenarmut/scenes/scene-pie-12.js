/* ═══════════════════════════════════════════════════════════════════
   SCENE — 12% Pie (Chapter 6, Scene 7)
   12% sector sweeps in, completing the cumulative pie.
═══════════════════════════════════════════════════════════════════ */

export default {
  id: 's-ch6-pie12',
  height: '150vh',
  skipSnapStart: true,
  snapPoints: [0.55],

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

    /* scene-pie-15 owns #st-ch6-pie15 fade-out. */
    tl.to('#st-ch6-pie12', { opacity: 1, duration: 0.12, ease: 'power1.out' }, 0.12);
    tl.to('#pov-pie-12',   { opacity: 1, duration: 0.01 }, 0.12);

    tl.to(proxy, {
      angle: 43.2,  // 12% of 360°
      duration: 0.30,
      ease: 'power2.out',
      onUpdate() {
        povPie12.setAttribute('d', sectorPath(POV_CX, POV_CY, POV_SUB_R, 0, Math.max(0.01, proxy.angle)));
      },
    }, 0.15);

    tl.to({}, { duration: 0.02 }, 0.98);
  },
};
