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
  snapPoints: [0.28],
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
      /* Step 1: "Abonnement" text fades in — grey circle stays, no animation yet. */
      .to('#st3',     { opacity: 1, duration: 0.20, ease: 'power1.out' }, 0.02)
      /* [snap at 0.28] — reader pauses here: text visible, grey circle only. */
      /* Step 2: Spinner appears and draws clockwise around the grey outline. */
      .to(cSpinner,   { opacity: 1, duration: 0.06 }, 0.32)
      .to(cSpinner,   { strokeDashoffset: 0, ease: 'power2.inOut', duration: 0.28 }, 0.36)
      /* Circle fills red, grey stroke hides — parallel with euro counter. */
      .to(cFill, { opacity: 1, attr: { 'fill-opacity': 1, 'stroke-opacity': 0 }, duration: 0.16, ease: 'power1.out' }, 0.66)
      /* Spinner fades out once the fill is visible. */
      .to(cSpinner,   { opacity: 0, duration: 0.08 }, 0.72)
      /* Euro counter starts counting at the same time the circle fills. */
      .to(euroContainer, { opacity: 1, duration: 0.12, ease: 'power1.out' }, 0.66)
      /* Short hold so everything is visible before moving on.
         #st3 stays visible — it fades out in circle-grow (s5) as the new text arrives. */
      .to({}, { duration: 0.06 }, 0.82);

    /* Pulse: starts when fill is visually complete (around 82% into s3). */
    ScrollTrigger.create({
      trigger:     '#s3',
      start:       '80% top',
      endTrigger:  '#s8',
      end:         'center bottom',
      onEnter:     pulse.start,
      onEnterBack: pulse.start,
      onLeave:     pulse.stop,
      onLeaveBack: pulse.stop,
    });
  },
};
