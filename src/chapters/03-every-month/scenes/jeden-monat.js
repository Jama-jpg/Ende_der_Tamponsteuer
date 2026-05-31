/* ═══════════════════════════════════════════════
   SCENE — Jeden Monat → 12 circles (s8)
   "Jeden Monat" and the split happen simultaneously on the first scroll:
   text swaps and the single mass tears into twelve month circles like a
   drop of viscous liquid.

   The split is driven procedurally (ScrollTrigger.onUpdate) instead of a fixed
   keyframe tween, so we can model real liquid behaviour:

     • Volume preservation — the circles drift apart first while keeping almost
       all their mass (radius barely shrinks), forming one massive stretched
       ellipse. Only afterwards do they neck down into thin gooey threads, and
       only at the very end do they snap to their final size.
     • Inertia / staggering — outer circles break out first and pull the strand
       long; the inner links lag behind (viscous drag), based on each circle's
       distance from the centre (index 5.5).
     • Bounciness — positions settle with an elastic back-ease so the drops
       spring into their slots like released rubber bands.
     • Crisp finish — the #gooey-blur is animated to 0 over the last third of
       the scrub, so the 12 circles end up perfectly round and sharp.

   Ends with the 12 circles in place for the Lifetime chapter.
═══════════════════════════════════════════════ */
import { CX, CY, MC_X, MC_Y, MC_R, PIE_R } from '../../../core/constants.js';

/* ── Split physics tuning ───────────────────────────────────────────── */
const HOLD       = 0.18;  // hold — big circle pulses visibly before split begins
const PH1        = 0.40;  // end of "plastic stretch" (mass kept, barely shrinks)
const PH2        = 0.72;  // end of "necking" (organic waves + thin threads)
const R_START    = 90;    // matches the big red circle (#c-fill r)
const R_P1       = 72;    // radius after the plastic stretch — still massive
const R_P2       = 45;    // radius after necking — thin connecting filaments
const R_END      = MC_R;  // final month-circle radius (15)
const STAGGER    = 0.16;  // how far the inner links lag behind the outer ones
const BOUNCE     = 4.5;   // elastic overshoot on the cy settle (back.out)
const SWAY       = 5;     // organic side-to-side wobble during the split (px)
const FULL_BLUR  = 10;    // gooey blur while the mass is connected
const CENTER_I   = 5.5;   // mid-point between the 12 indices (0…11)

const clamp = (v, lo, hi) => (v < lo ? lo : v > hi ? hi : v);
const lerp  = (a, b, t) => a + (b - a) * t;

export default {
  id: 's8',
  height: '1400vh',
  skipSnapStart: true,

  init({ gsap, stage }) {
    const { cFill, mCircles, mcEls, gooeyBlur } = stage.refs;

    const backOut = gsap.parseEase(`back.out(${BOUNCE})`);
    const massEase = gsap.parseEase('power1.in');  // keeps the mass high early
    const snapEase = gsap.parseEase('power2.in');  // brisk final shrink

    /* Procedural liquid split — recomputed every scroll frame. */
    function render(p) {
      // Overall split progress, after the initial "full circle" hold.
      const sp = clamp((p - HOLD) / (1 - HOLD), 0, 1);

      // Gooey blur resolves to 0 over the last third so the drops snap crisp.
      const blur = sp <= PH2 ? FULL_BLUR
        : FULL_BLUR * (1 - (sp - PH2) / (1 - PH2));
      gooeyBlur.setAttribute('stdDeviation', blur.toFixed(2));

      for (let i = 0; i < mcEls.length; i++) {
        // Distance from centre drives inertia: outer circles lead (delay 0),
        // inner links lag (viscous drag).
        const normDist = Math.abs(i - CENTER_I) / CENTER_I;   // 0.09 … 1
        const delay    = (1 - normDist) * STAGGER;
        const t        = clamp((sp - delay) / (1 - STAGGER), 0, 1);

        // Volume-preserving radius: barely shrinks, then necks, then snaps.
        let r;
        if (t <= PH1)      r = lerp(R_START, R_P1, massEase(t / PH1));
        else if (t <= PH2) r = lerp(R_P1, R_P2, (t - PH1) / (PH2 - PH1));
        else               r = lerp(R_P2, R_END, snapEase((t - PH2) / (1 - PH2)));

        // Position springs toward the month slot with an elastic overshoot.
        const cy = CY + (MC_Y[i] - CY) * backOut(t);

        // Organic side wobble that vanishes exactly at the ends (sin(0)=sin(π)=0).
        const cx = MC_X + Math.sin(i * 1.7) * SWAY * Math.sin(Math.PI * t);

        const el = mcEls[i];
        el.setAttribute('r',  r.toFixed(2));
        el.setAttribute('cy', cy.toFixed(2));
        el.setAttribute('cx', cx.toFixed(2));
      }
    }

    /* Split occupies the first 65% of scroll; text appears after. */
    const SPLIT_END = 0.65;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '#s8', start: 'top top', end: 'bottom bottom', scrub: 1,
        onUpdate: (self) => render(Math.min(self.progress / SPLIT_END, 1)),
        onRefresh: (self) => render(Math.min(self.progress / SPLIT_END, 1)),
      },
    });

    tl
      /* Big circle contracts from PIE_R→R_START during hold — the "wird enger" moment. */
      .fromTo(cFill, { attr: { r: PIE_R } }, { attr: { r: R_START }, ease: 'power2.in', duration: HOLD * 0.9 }, 0)
      /* Month circles take over exactly as the contraction finishes. */
      .set(mCircles, { opacity: 1 }, HOLD)
      .to(cFill, { opacity: 0, duration: 0.04, ease: 'power1.out' }, HOLD)
      /* Previous scene text out just before circles settle. */
      .to('#st5', { opacity: 0, duration: 0.08, ease: 'power1.in' }, 0.60)

    render(0);
  },
};
