/* ═══════════════════════════════════════════════
   SCENE — Circle fill (s4)
   Loading spinner draws around the outline, then the solid circle fills.
═══════════════════════════════════════════════ */

export default {
  id: 's4',
  height: '250vh',
  skipSnapStart: true,

  init({ gsap, stage }) {
    const { cSpinner, cFill, cOutline } = stage.refs;

    const tl = gsap.timeline({
      scrollTrigger: { trigger: '#s4', start: 'top top', end: 'bottom bottom', scrub: 1.5 },
    });

    tl
      .to(cSpinner, { opacity: 1, duration: 0.08 }, 0)
      .to(cSpinner, { strokeDashoffset: 0, ease: 'power2.inOut', duration: 0.65 }, 0.04)
      .to(cFill,    { opacity: 1, duration: 0.18, ease: 'power1.out' }, 0.75)
      .to([cSpinner, cOutline], { opacity: 0, duration: 0.12 }, 0.88);
  },
};
