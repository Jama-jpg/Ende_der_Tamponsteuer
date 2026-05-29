/* ═══════════════════════════════════════════════
   SCENE — Period axis (s3)
   First scroll-driven scene. Period dots, circle outline and the
   "Abonnement" text appear on the very first scroll.
═══════════════════════════════════════════════ */

export default {
  id: 's3',
  height: '200vh',
  overlay: {
    id: 'st3',
    html: `<p class="sl">STELL DIR VOR, DEIN KÖRPER<br>HAT EIN ABONNEMENT<br>ABGESCHLOSSEN, DAS DU NICHT<br>BEENDEN KANNST.</p>`,
  },

  init({ gsap, stage }) {
    const r = stage.refs;

    const tl = gsap.timeline({
      scrollTrigger: { trigger: '#s3', start: 'top top', end: 'bottom bottom', scrub: 1.5 },
    });

    tl
      .to(r.periodDots, { opacity: 1, duration: 0.2 }, 0.0)
      .to(r.cOutline,   { opacity: 1, duration: 0.2, ease: 'power1.out' }, 0.06)
      .to('#st3',       { opacity: 1, duration: 0.2 }, 0.10);
  },
};
