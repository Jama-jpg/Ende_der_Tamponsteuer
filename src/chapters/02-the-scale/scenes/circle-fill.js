/* ═══════════════════════════════════════════════
   SCENE — Circle fill (s4) — start of Chapter 2
   Loading spinner draws around the outline, then the solid circle fills.
   Also: the moment Chapter 2 starts, the "MwST." part fades in next to the
   shrunk "0%" at the bottom, forming the persistent "0% MwST." label.
═══════════════════════════════════════════════ */

export default {
  id: 's4',
  height: '250vh',

  init({ gsap, ScrollTrigger, stage }) {
    const { cSpinner, cFill, cOutline, vatBigTax } = stage.refs;

    const tl = gsap.timeline({
      scrollTrigger: { trigger: '#s4', start: 'top top', end: 'bottom bottom', scrub: 1.5 },
    });

    tl
      .to(cSpinner, { opacity: 1, duration: 0.08 }, 0)
      .to(cSpinner, { strokeDashoffset: 0, ease: 'power2.inOut', duration: 0.65 }, 0.04)
      .to(cFill,    { opacity: 1, duration: 0.18, ease: 'power1.out' }, 0.75)
      .to([cSpinner, cOutline], { opacity: 0, duration: 0.12 }, 0.88);

    /* "MwST." appears automatically right as Chapter 2 begins (display:none →
       inline, then fade in); removed from flow again on scroll back to intro. */
    ScrollTrigger.create({
      trigger: '#s4',
      start:   'top top',
      onEnter: () => {
        gsap.set(vatBigTax, { display: 'inline' });
        gsap.to(vatBigTax, { opacity: 1, duration: 0.5, ease: 'power1.out' });
      },
      onLeaveBack: () => {
        gsap.to(vatBigTax, {
          opacity: 0, duration: 0.3, ease: 'power1.in',
          onComplete: () => gsap.set(vatBigTax, { display: 'none' }),
        });
      },
    });
  },
};
