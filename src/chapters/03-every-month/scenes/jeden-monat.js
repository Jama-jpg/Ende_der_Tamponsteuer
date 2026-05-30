/* ═══════════════════════════════════════════════
   SCENE — Jeden Monat → 12 circles (s8)
   "Jeden Monat" lands over the full red circle, then — in one continuous
   scrub — the single mass splits into twelve month circles like a drop of
   viscous liquid tearing apart.

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
import { CX, CY, MC_X, MC_Y, MC_R } from '../../../core/constants.js';

/* ── Split physics tuning ───────────────────────────────────────────── */
const HOLD       = 0.32;  // scrub fraction the full circle holds before splitting
const PH1        = 0.40;  // end of "plastic stretch" (mass kept, barely shrinks)
const PH2        = 0.72;  // end of "necking" (organic waves + thin threads)
const R_START    = 90;    // matches the big red circle (#c-fill r)
const R_P1       = 72;    // radius after the plastic stretch — still massive
const R_P2       = 45;    // radius after necking — thin connecting filaments
const R_END      = MC_R;  // final month-circle radius (15)
const STAGGER    = 0.16;  // how far the inner links lag behind the outer ones
const BOUNCE     = 2.2;   // elastic overshoot on the cy settle (back.out)
const SWAY       = 5;     // organic side-to-side wobble during the split (px)
const FULL_BLUR  = 10;    // gooey blur while the mass is connected
const CENTER_I   = 5.5;   // mid-point between the 12 indices (0…11)

const clamp = (v, lo, hi) => (v < lo ? lo : v > hi ? hi : v);
const lerp  = (a, b, t) => a + (b - a) * t;

export default {
  id: 's8',
  height: '220vh',
  overlay: {
    id: 'st8',
    html: `<p class="sl">UND DAS</p>
           <p class="sh">JEDEN MONAT</p>`,
  },

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

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '#s8', start: 'top top', end: 'bottom bottom', scrub: 1.5,
        onUpdate: (self) => render(self.progress),
        onRefresh: (self) => render(self.progress),
      },
    });

    tl
      /* "Jeden Monat" lands while the big circle is still pulsing … */
      .to('#st8', { opacity: 1, duration: 0.14, ease: 'power1.out' }, 0.04)
      /* … after the hold, the gooey mass crossfades in and the disc fades out … */
      .set(mCircles, { opacity: 1 }, HOLD)
      .to(cFill, { opacity: 0, scaleY: 1, svgOrigin: `${CX} ${CY}`, duration: 0.08, ease: 'power1.out' }, HOLD + 0.01)
      /* … then it stretches, necks and tears into 12 drops (see render()). */
      /* Text clears before the next scene. */
      .to('#st8', { opacity: 0, duration: 0.12, ease: 'power1.in' }, 0.92);

    render(0);
  },
};
