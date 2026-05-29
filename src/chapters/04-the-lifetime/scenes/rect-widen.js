/* ═══════════════════════════════════════════════
   SCENE — Rect widens (s11)
   The thin column expands into a wide rectangle (the 38-year span). The
   7-year highlight rect is kept position-synced for its later reveal.
═══════════════════════════════════════════════ */

export default {
  id: 's11',
  height: '150vh',

  init({ gsap, stage }) {
    const { mRect, rRect } = stage.refs;

    const tl = gsap.timeline({
      scrollTrigger: { trigger: '#s11', start: 'top top', end: 'bottom bottom', scrub: 1.5 },
    });

    tl
      .to(mRect, { attr: { x: 650, width: 150 }, ease: 'power2.inOut', duration: 0.7 }, 0)
      .to(rRect, { attr: { x: 650, width: 150 }, ease: 'power2.inOut', duration: 0.7 }, 0);
  },
};
