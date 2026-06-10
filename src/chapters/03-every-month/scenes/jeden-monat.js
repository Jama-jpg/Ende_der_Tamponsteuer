/* ═══════════════════════════════════════════════
   SCENE — Jeden Monat → 12 circles (s8)
   "Jeden Monat" and the split happen simultaneously on the first scroll:
   text swaps and the single mass tears into twelve month circles like a
   drop of viscous liquid.

   Phase 1 — Hold (0 → HOLD):
     The big red circle (cFill) stays visible and continues pulsing.
     Clean, seamless handoff — no displacement filter, no jagged edges.

   Phase 2 — Gooey split (HOLD → 1):
     12 overlapping circles replace cFill at identical position/size.
     The gooey filter creates viscous necks as they tear apart:
       • Volume preservation — radius barely shrinks at first
       • Inertia/staggering — outer circles lead, inner ones drag
       • Bounciness — elastic back-ease as drops snap into slots
       • Crisp finish — gooey blur resolves to 0 at the end

   Ends with the 12 circles in place for the Lifetime chapter.
═══════════════════════════════════════════════ */
import { CX, CY, PIE_R, MC_X, MC_Y, MC_R } from '../../../core/constants.js';
import { textIn, textOut, setSceneVh } from '../../../core/text-anim.js';

/* ── Split physics tuning ───────────────────────────────────────────── */
const HOLD       = 0.06;  // hold — big circle visible before split begins
const PH1        = 0.40;  // end of "plastic stretch"
const PH2        = 0.72;  // end of "necking"
const R_START    = PIE_R; // start at full size — seamlessly replaces cFill
const R_P1       = 72;
const R_P2       = 45;
const R_END      = MC_R;
const STAGGER    = 0.12;
const BOUNCE     = 4.5;
const SWAY       = 5;
const FULL_BLUR  = 10;
const CENTER_I   = 5.5;

const clamp = (v, lo, hi) => (v < lo ? lo : v > hi ? hi : v);
const lerp  = (a, b, t)  => a + (b - a) * t;

export default {
  id: 's8',
  height: '500vh',
  skipSnapStart: true,
  overlay: {
    id: 'st8',
    html: `<p class="sl">UND DAS</p>
           <p class="sh">JEDEN MONAT</p>`,
  },

  init({ gsap, stage }) {
    setSceneVh(500);
    const { cFill, mCircles, mcEls, gooeyBlur, pieHl } = stage.refs;

    const backOut  = gsap.parseEase(`back.out(${BOUNCE})`);
    const massEase = gsap.parseEase('power1.in');
    const snapEase = gsap.parseEase('power2.in');

    /* ── render(p) ────────────────────────────────────────────────── */
    function render(p) {
      /* Phase 1 — Hold: cFill is still showing, nothing to compute yet. */
      if (p <= HOLD) return;

      /* Phase 2 — Split: gooey physics. */
      const sp = clamp((p - HOLD) / (1 - HOLD), 0, 1);

      const BLUR_RAMP = 0.05;
      const blur = sp < BLUR_RAMP
        ? 0
        : sp <= PH2
          ? FULL_BLUR * Math.min((sp - BLUR_RAMP) / (PH2 - BLUR_RAMP), 1)
          : FULL_BLUR * (1 - (sp - PH2) / (1 - PH2));
      gooeyBlur.setAttribute('stdDeviation', blur.toFixed(2));

      /* Disable gooey filter at blur=0: feColorMatrix sharpens anti-aliased
         edges and would look different from cFill — filter:none keeps it seamless. */
      mCircles.setAttribute('filter', blur >= 1 ? 'url(#gooey)' : 'none');

      for (let i = 0; i < mcEls.length; i++) {
        const normDist = Math.abs(i - CENTER_I) / CENTER_I;
        const delay    = (1 - normDist) * STAGGER;
        const t        = clamp((sp - delay) / (1 - STAGGER), 0, 1);

        let r;
        if (t <= PH1)      r = lerp(R_START, R_P1, massEase(t / PH1));
        else if (t <= PH2) r = lerp(R_P1, R_P2, (t - PH1) / (PH2 - PH1));
        else               r = lerp(R_P2, R_END, snapEase((t - PH2) / (1 - PH2)));

        const rawCy = CY + (MC_Y[i] - CY) * backOut(t);
        const cy    = clamp(rawCy, r + 2, 562 - r - 2);
        const cx    = MC_X + Math.sin(i * 1.7) * SWAY * Math.sin(Math.PI * t);

        const el = mcEls[i];
        el.setAttribute('r',  r.toFixed(2));
        el.setAttribute('cy', cy.toFixed(2));
        el.setAttribute('cx', cx.toFixed(2));
      }
    }

    /* Split occupies the first 65% of scroll; text appears after. */
    const SPLIT_END = 0.65;

    /* Track hold vs. split phase so the cFill ↔ mCircles crossfade fires
       exactly once per direction. */
    let prevInHold = true;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '#s8', start: 'top top', end: 'bottom bottom', scrub: 0.4,
        onUpdate(self) {
          const p       = Math.min(self.progress / SPLIT_END, 1);
          const inHold  = p <= HOLD;

          /* Phase transition: swap which element is visible. */
          if (prevInHold !== inHold) {
            prevInHold = inHold;
            if (inHold) {
              /* Scrolled back into hold — cFill takes over again. */
              gsap.set(cFill,    { opacity: 1 });
              gsap.set(mCircles, { opacity: 0 });
            } else {
              /* Entering split — mCircles seamlessly replace cFill. */
              gsap.set(cFill,    { opacity: 0 });
              gsap.set(mCircles, { opacity: 1 });
            }
          }

          render(p);
        },

        onRefresh: (self) => render(Math.min(self.progress / SPLIT_END, 1)),
      },
    });

    textOut(tl, '#st7', 0);
    textIn(tl, '#st8', 0.10);

    tl
      /* Fade out pie sector from previous scene. */
      .to(pieHl, { opacity: 0, duration: 0.08, ease: 'power1.in' }, 0);

    /* Initial position: all 12 circles stacked at (775,281,r=PIE_R) — visually
       identical to cFill. prevInHold=true so no opacity change here. */
    render(0);
  },
};
