/* ═══════════════════════════════════════════════
   SCENE — Period axis + Circle fill (s3)
   Combined: "Abonnement" text fades in; the spinner draws clockwise around
   the outline, the solid circle fills, spinner + outline fade out. Once the
   circle is full, the pulse starts and the euro counter hint appears. The
   VAT display switches from 0% → 20% after the user has scrolled 15% in
   (guards against the intro's programmatic scroll firing the trigger).
═══════════════════════════════════════════════ */

export default {
  id: 's3',
  height: '400vh',
  overlay: {
    id: 'st3',
    html: `<p class="sl">STELL DIR VOR, DEIN KÖRPER<br>HAT EIN ABONNEMENT<br>ABGESCHLOSSEN, DAS DU NICHT<br>BEENDEN KANNST.</p>`,
  },

  init({ gsap, ScrollTrigger, stage, controllers }) {
    const { cSpinner, cFill, cOutline, vatBigNum } = stage.refs;
    const { pulse } = controllers;
    const euroContainer = document.getElementById('euro-counter');

    /* VAT: switch 0% → 20% only after the user has scrolled 15% into this
       section. The intro's programmatic scrollTo lands on s3's top edge, so a
       'top top' trigger would fire immediately — the 15% offset prevents that. */
    ScrollTrigger.create({
      trigger:     '#s3',
      start:       '15% top',
      onEnter:     () => { vatBigNum.textContent = '20'; },
      onLeaveBack: () => { vatBigNum.textContent = '0'; },
    });

    const tl = gsap.timeline({
      scrollTrigger: { trigger: '#s3', start: 'top top', end: 'bottom bottom', scrub: 1.5 },
    });

    tl
      /* "Abonnement" text fades in. */
      .to('#st3',     { opacity: 1, duration: 0.08, ease: 'power1.out' }, 0.02)
      /* Spinner appears, then draws clockwise around the outline. */
      .to(cSpinner,   { opacity: 1, duration: 0.06 }, 0.08)
      .to(cSpinner,   { strokeDashoffset: 0, ease: 'power2.inOut', duration: 0.30 }, 0.12)
      /* Solid fill fades in once the stroke is nearly complete. */
      .to(cFill,      { opacity: 1, duration: 0.16, ease: 'power1.out' }, 0.46)
      /* Spinner and outline fade out — clean solid circle. */
      .to([cSpinner, cOutline], { opacity: 0, duration: 0.10 }, 0.58)
      /* Euro counter hint appears when circle is fully filled. */
      .to(euroContainer, { opacity: 1, duration: 0.10, ease: 'power1.out' }, 0.68)
      /* Hold: user reads text, circle pulses, euro counter is visible. */
      .to({}, { duration: 0.22 }, 0.78);

    /* Pulse: starts when circle is fully filled (62% into s3), keeps running
       through the grow (s5) and pie-hover (s7) until the split in s8. */
    ScrollTrigger.create({
      trigger:     '#s3',
      start:       '62% top',
      endTrigger:  '#s8',
      end:         'center bottom',
      onEnter:     pulse.start,
      onEnterBack: pulse.start,
      onLeave:     pulse.stop,
      onLeaveBack: pulse.stop,
    });
  },
};
