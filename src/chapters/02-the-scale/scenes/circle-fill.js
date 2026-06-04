/* ═══════════════════════════════════════════════
   SCENE — Circle fill (s4)
   Loading spinner draws around the outline, then the solid circle fills.
═══════════════════════════════════════════════ */

export default {
  id: 's4',
  height: '250vh',
  skipSnapStart: true,

  init({ gsap, ScrollTrigger, stage }) {
    const { cSpinner, cFill, cOutline, vatBigNum } = stage.refs;
    const euroContainer = document.getElementById('euro-counter');

    /* Switch the VAT display from 0% → 20% MwST. when Chapter 2 is at the top. */
    ScrollTrigger.create({
      trigger:     '#s4',
      start:       'top top',
      onEnter:     () => { vatBigNum.textContent = '20'; },
      onLeaveBack: () => { vatBigNum.textContent = '0'; },
    });

    const tl = gsap.timeline({
      scrollTrigger: { trigger: '#s4', start: 'top top', end: 'bottom bottom', scrub: 0.4 },
    });

    tl
      .to(cSpinner, { opacity: 1, duration: 0.08 }, 0)
      .to(cSpinner, { strokeDashoffset: 0, ease: 'power2.inOut', duration: 0.65 }, 0.04)
      .to(cFill,    { opacity: 1, duration: 0.18, ease: 'power1.out' }, 0.75)
      .to([cSpinner, cOutline], { opacity: 0, duration: 0.12 }, 0.88)
      .to(euroContainer, { opacity: 1, duration: 0.08, ease: 'power1.out' }, 0.92);
  },
};
