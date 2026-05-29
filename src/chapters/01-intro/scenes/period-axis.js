/* ═══════════════════════════════════════════════
   SCENE — Period axis (s3)
   Scroll spacer that holds the "Abonnement" text on screen. The period
   dots, circle outline and this text are all built up during the intro
   transition (see countdown.js) so they're already in place when the
   spine finishes drawing — this scene only contributes scroll length.
═══════════════════════════════════════════════ */

export default {
  id: 's3',
  height: '200vh',
  overlay: {
    id: 'st3',
    html: `<p class="sl">STELL DIR VOR, DEIN KÖRPER<br>HAT EIN ABONNEMENT<br>ABGESCHLOSSEN, DAS DU NICHT<br>BEENDEN KANNST.</p>`,
  },
};
