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
  height: '250vh',
  skipSnapStart: true,
  snapPoints: [0.50],
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
      scrollTrigger: { trigger: '#s3', start: 'top top', end: 'bottom bottom', scrub: 0.4 },
    });

    tl
      /* "Abonnement" text fades in. */
      .to('#st3',     { opacity: 1, duration: 0.08, ease: 'power1.out' }, 0.02)
      /* Spinner appears, then draws clockwise around the outline. */
      .to(cSpinner,   { opacity: 1, duration: 0.06 }, 0.08)
      .to(cSpinner,   { strokeDashoffset: 0, ease: 'power2.inOut', duration: 0.30 }, 0.12)
      /* Make element visible, fill it red, hide grey stroke — all in one step. */
      .to(cFill, { opacity: 1, attr: { 'fill-opacity': 1, 'stroke-opacity': 0 }, duration: 0.16, ease: 'power1.out' }, 0.44)
      /* Spinner fades out once the fill is visible (cOutline IS cFill — stays visible). */
      .to(cSpinner,   { opacity: 0, duration: 0.08 }, 0.50)
      /* Euro counter appears simultaneously as the circle fills. */
      .to(euroContainer, { opacity: 1, duration: 0.12, ease: 'power1.out' }, 0.44)
      /* Short hold so everything is visible before moving on. */
      .to({}, { duration: 0.06 }, 0.58)
      /* Text fades out before circle-grow begins — scene owns its lifecycle. */
      .to('#st3', { opacity: 0, duration: 0.08, ease: 'power1.in' }, 0.88);

    /* Pulse: starts when fill is visually complete, keeps running through
       the grow (s5) and pie-hover (s7) until the split in s8. */
    ScrollTrigger.create({
      trigger:     '#s3',
      start:       '50% top',
      endTrigger:  '#s8',
      end:         'center bottom',
      onEnter:     pulse.start,
      onEnterBack: pulse.start,
      onLeave:     pulse.stop,
      onLeaveBack: pulse.stop,
    });
  },
};
