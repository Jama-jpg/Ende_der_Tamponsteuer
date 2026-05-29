/* ═══════════════════════════════════════════════
   SCENE — Period axis (s3)
   The spine, period dots and circle outline are already built up during the
   intro transition (see countdown.js); only the scroll hint is shown there.
   The "Abonnement" text is held hidden and fades in as soon as the reader
   starts scrolling, then stays on screen for the rest of the scene.
═══════════════════════════════════════════════ */

export default {
  id: 's3',
  height: '200vh',
  overlay: {
    id: 'st3',
    html: `<p class="sl">STELL DIR VOR, DEIN KÖRPER<br>HAT EIN ABONNEMENT<br>ABGESCHLOSSEN, DAS DU NICHT<br>BEENDEN KANNST.</p>`,
  },

  init({ gsap }) {
    const tl = gsap.timeline({
      scrollTrigger: { trigger: '#s3', start: 'top top', end: 'bottom bottom', scrub: 1.5 },
    });

    /* Fade the text in over the first slice of the scene, then hold it. */
    tl
      .to('#st3', { opacity: 1, duration: 0.18, ease: 'power1.out' }, 0)
      .to({},     { duration: 0.82 }); // hold visible through the rest of s3
  },
};
